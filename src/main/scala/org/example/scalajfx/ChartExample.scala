package org.example.scalajfx

import javafx.scene.{ control => jfxc }
import javafx.{ fxml => jfxf }
import javafx.{ scene => jfxs }
import jfxs.{ chart => jfxch }
import scalafx.application.JFXApp.PrimaryStage
import scalafx.Includes._
import scalafx.application.JFXApp
import scalafx.scene.Scene
import java.net.URL
import java.util.ResourceBundle
import scalafx.scene.chart.XYChart
import scalafx.collections.ObservableBuffer
import scala.util.Random
import javafx.scene.chart.NumberAxis

object ChartExample extends JFXApp with AppDatabase {

  initializeDB()
  val loader = new jfxf.FXMLLoader;

  val root: jfxs.Parent = jfxf.FXMLLoader.load(getClass.getResource("/chart.fxml"))
  stage = new PrimaryStage() {
    title = "FXML GridPane Demo"
    scene = new Scene(root)
  }
}

class GraphController extends jfxf.Initializable {

  @jfxf.FXML
  var chart: jfxch.LineChart[Int, Int] = _

  override def initialize(url: URL, rb: ResourceBundle) = {
    import XYChart._

    val data = new ObservableBuffer[jfxch.XYChart.Data[Int, Int]]()
    data += Data(1, 1)
    data += Data(2, 2)

    val series = XYChart.Series("test", data)
    chart.getData() add series

    async {
      var i = 3
      var prev = 2
      val rnd = new Random

      while (true) {
        prev += rnd.nextInt(10) - 5
        prev = prev.min(200).max(0)

        data += Data(i, prev)

        val axis = chart.getXAxis().asInstanceOf[NumberAxis]
        axis.setLowerBound((i-200) max 0)
        axis.setUpperBound(i)

        i += 24
        Thread.sleep(800)
      }
    }
  }

  def async[F](f: => F) = {
    val t = new Thread(new Runnable() { def run() { f } })
    t.setDaemon(true)
    t.start
    t
  }
}