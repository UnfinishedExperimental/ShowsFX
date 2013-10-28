package org.example.scalajfx

import java.net.URL
import java.util.ResourceBundle
import javafx.scene.input.MouseEvent
import javafx.scene.{control => jfxc}
import javafx.{fxml => jfxf}
import javafx.{scene => jfxs}
import scalafx.Includes._
import scalafx.application.JFXApp
import scalafx.application.JFXApp.PrimaryStage
import scalafx.application.Platform
import scalafx.beans.property._
import scalafx.collections.ObservableBuffer
import scalafx.scene.Scene
import scalafx.scene.control.ListView
import scalafx.scene.control.SelectionMode
import scalafx.scene.control.cell.TextFieldListCell
import scalafx.util.StringConverter

import rx.util.functions.Action0
import rx.util.functions.Action1
import rx.util.functions.Func1
import scala.slick.driver.HsqldbDriver.simple._
import Database.threadLocalSession

object JfxApplication extends JFXApp with AppDatabase {     
  
  initializeDB()
  val loader = new jfxf.FXMLLoader;
  
  val root: jfxs.Parent = jfxf.FXMLLoader.load(getClass.getResource("/skel.fxml"))
  stage = new PrimaryStage() {
    title = "FXML GridPane Demo"
    scene = new Scene(root)
    scene.get.getStylesheets().add("customStyles.css");
  }    
}

class JfxApplicationController extends jfxf.Initializable {

  @jfxf.FXML 
  var shows:jfxc.ListView[Show] = _
  
  @jfxf.FXML 
  var episodes:jfxc.ListView[Episode] = _
  
  @jfxf.FXML 
  var latest:jfxc.ListView[Episode] = _
  
  override def initialize(url: URL, rb: ResourceBundle) = {   
    val converter = StringConverter.toStringConverter[Show](_.name);
    shows.cellFactory = TextFieldListCell.forListView (converter)
    shows.selectionModel.value.setSelectionMode(SelectionMode.SINGLE)
         
    episodes.cellFactory_= (lv => new EpisodeCell())
    episodes.selectionModel.value.setSelectionMode(SelectionMode.SINGLE)
    
    val selectedShow = shows.selectionModel.get.selectedItem
    val selectedEpisode = episodes.selectionModel.get.selectedItem
    
    selectedShow onChange ((v, o, n) => {   
        episodes.items = ObservableBuffer()
        TVCountdownParser.getEpisodes(n).subscribe((e:Episode) =>           
          JfxApplication.DB withSession   {
            
            var ep = Episodes.insertOrMerge(e)
            
            Platform.runLater {
              val a = episodes.itemsProperty.get.add(ep)
            }
          })
      }) 
    
    updateSeasonList()
    updateFavoriteList()
  }    

  @jfxf.FXML
  def itemClicked(event:MouseEvent) = {
  }  
  
  def updateSeasonList() = 
    shows.itemsProperty.get.clear
  TVCountdownParser.getShows().subscribe((s:Show) => {
      JfxApplication.DB withSession   {
        val show = Shows.insertOrMerge(s)
      
        Platform.runLater{
          val a = shows.itemsProperty.get.add(show)
        }
      } 
    })
      
  
  def updateFavoriteList() ={
    latest.itemsProperty.get.clear
    var fav = Seq("8-out-of-10-cats", "the-walking-dead", "the-big-bang-theory", "the-big-c")
    JfxApplication.DB withSession {
      var favShows = for(s <- Shows if s.url inSetBind fav) yield s
      
      var episodes = for{e <- Episodes
                         s <- favShows if e.showID is s.id                         
      } yield e
  
      var e = episodes.list      
      e foreach latest.itemsProperty.get.add _     
    }
  }

  object ScalaFXConverter
  {
    implicit def jfxListView2sfx[T](l:jfxc.ListView[T]) = new ListView(l)
  }

  class EpisodeCell extends jfxc.ListCell[Episode]
  {
    override def updateItem(item:Episode, empty:Boolean) = {
      super.updateItem(item, empty)
    
      if(!empty && item != null){
        val epTitel = (e:Episode) => "S%02dE%02d %s" format(e.season, e.number, e.name.getOrElse("---"))
    
        setText(epTitel(item))
      
        getStyleClass.removeAll("airedEpisode", "futureEpisode")
        if(item.aired)        
          getStyleClass.add("airedEpisode")
        else
          getStyleClass.add("futureEpisode")
      }
    }
  }
}
