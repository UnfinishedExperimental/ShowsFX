/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package org.example.scalajfx

import com.fasterxml.jackson.core.JsonFactory
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonToken
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.util.Date
import rx.Observable
import rx.Observer
import rx.Subscription
import scala.xml.Text


object TVCountdownParser {
  val mapper = new ObjectMapper()  
  mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
  mapper.registerModule(DefaultScalaModule)
  
  val URL = "http://tvcountdown.com/js/shows.js"
  type DATA_TYPE = (String,Int,String,Option[Int],String,Int) 
    
  def getShows = Observable.create((m:Observer[Show]) => {
      val t = async {
        val js = io.Source.fromURL(URL).mkString    
        val json = js.substring(js.indexOf('=') + 1)
        .replace(",,", ",null,")
        .replace(",]", ",null]")
        .replace("[,", "[null,")
    
        val factory = new JsonFactory();
        val parser = factory.createJsonParser(json);
        // advance stream to START_ARRAY first:
        parser.nextToken();
        // and then each time, advance to opening START_OBJECT
        while (parser.nextToken() == JsonToken.START_ARRAY) {
          val show = mapper.readValue(parser, classOf[Array[String]])
          m.onNext(Show(show(0), show(2)))
        }
      
        m.onCompleted
      }
      new Subscription() {
        override def unsubscribe = {t.interrupt}
      }
    })
    
  
  def getEpisodes(show:Show) = Observable.create((m:Observer[Episode]) => {
      val t = async {        
        val url = s"http://tvcountdown.com/s/${show.url}?all"
        
        val source = new org.xml.sax.InputSource(url)
        val root = HTML5Parser.loadXML(source)
        
        val site = root.text 
        val start = site.indexOf("timestamp")
        val line = site.substring(start, site.indexOf('\n', start))
        val timestamps = line.substring(line.indexOf('['), line.length - 2)
        
//        19 September, 2011 21:00:00
        val format = new SimpleDateFormat("dd MMMM, yyyy HH:mm:ss")
        val dates = mapper.readValue(timestamps, classOf[Array[String]]) map (_ match{
            case "" => null
            case d => format.parse(d)
          })
        
        val divs = root \\ "div"
        val episodes = divs.filter(
          ns => {
            val clazz = (ns \ "@class")
            clazz.text startsWith "sixteen columns bc_"
          })
      
        for((epDiv, i) <- episodes.view zipWithIndex){
          val number = parseNumber(epDiv.child(1).text)
          val name = epDiv.child(2).text
          val date = dates(i) match{
            case null => null
            case d => new Timestamp(d.getTime)
          }
          
          m onNext Episode(show.id, number._1, number._2, name, date)
        }
        
        println(episodes)
        m.onCompleted
      }
      new Subscription() {
        override def unsubscribe = {t.interrupt}
      };
    })
  
  def parseNumber(s:String)= {
    val numbers = """S(\d{2})E(\d{2})""".r
    val numbers(season, episode) = s
    (season.toInt, episode.toInt)
  }
  
  def parseDate(s:String) = {
    new Timestamp(2)
  }

  def async[F](f: => F) = {
    val t = new Thread( new Runnable() { def run() { f } })
    t.setDaemon(true)
    t.start
    t
  
  }

}
