package org.example.scalajfx

import java.net.URL
import java.util.ResourceBundle
import javafx.scene.input.MouseEvent
import javafx.scene.{control => jfxc}
import javafx.{fxml => jfxf}
import javafx.{scene => jfxs}
import scala.slick.session.Database
import scala.slick.driver.HsqldbDriver.simple._
import Database.threadLocalSession
import scalafx.Includes._
import scalafx.application.JFXApp
import scalafx.application.JFXApp.PrimaryStage
import scalafx.beans.property._
import scalafx.collections.ObservableBuffer
import scalafx.event.ActionEvent
import scalafx.scene.Scene
import scalafx.scene.control.ListView
import scalafx.scene.control.cell.TextFieldListCell
import scalafx.util.StringConverter

object JfxApplication extends JFXApp {   
  val db = Database.forURL("jdbc:hsqldb:mem:testDB", user ="sa", password="", driver = "org.hsqldb.jdbcDriver")
  
  val root: jfxs.Parent = jfxf.FXMLLoader.load(getClass.getResource("/skel.fxml"))
  stage = new PrimaryStage() {
    title = "FXML GridPane Demo"
    scene = new Scene(root)
  }  
}


case class Person(id:Int, name:String)
object Persons extends Table[Person]("PERSONS")
{
  def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)
  def name = column[String]("NAME")
  
  def * = id ~ name <> (Person, Person.unapply _)
}

class JfxApplicationController extends jfxf.Initializable {

  @jfxf.FXML 
  var list:jfxc.ListView[Person] = _
  
  override def initialize(url: URL, rb: ResourceBundle) = {   
    JfxApplication.db withSession {
      Persons.ddl create  
      
//      val persons = Seq("Tobi","Dani").map(Person(_))
      
      printPerson(newUser("Tobi"))
      printPerson(newUser("Dani"))
      printPerson(newUser("Fabian"))
      
      updateList
      
      val converter = StringConverter.toStringConverter[Person](_.name);
      list.cellFactory = TextFieldListCell.forListView (converter)
    }    
  }
  
  def updateList = list.items = ObservableBuffer(allPersons)
  
  @jfxf.FXML
  def itemClicked(event:MouseEvent) = {
    if(event.clickCount > 1)
    {
      val person = list.getSelectionModel().getSelectedItem()
      delete(person)
      updateList
    }
  }  
  
  def printPerson(p:Person) = println(s"Person with id:${p.id} name:${p.name}")
  
  def newUser(name:String) = JfxApplication.db withSession {
    val id = Persons.name returning Persons.id insert name
    Person(id, name)
  }
  
  def save(user: Person) = JfxApplication.db withSession {
    Query(Persons).where(_.id is user.id).update(user)  
  }
  
  def delete(person: Person) = JfxApplication.db withSession {
    Query(Persons).where(_.id is person.id) delete
  }
  
  def allPersons = JfxApplication.db withSession {
    Query(Persons).sortBy(_.name.asc).list
  }
}

object ScalaFXConverter
{
  implicit def jfxListView2sfx[T](l:ListView[T]) = new ListView(l)
}
