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

object TVCountdownParser {
  val mapper = new ObjectMapper()
  mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
  mapper.registerModule(DefaultScalaModule)

  val URL = "http://tvcountdown.com/js/shows.js"
  type DATA_TYPE = (String, Int, String, Option[Int], String, Int)

  def getShows() = Observable.create((m: Observer[Show]) => {
    val t = async {
      try {
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
          if (show.length >= 3)
            m.onNext(Show(show(0), show(2)))
        }

        m.onCompleted
      } catch {
        case _: Throwable => m.onError _
      }
    }
    new Subscription() {
      override def unsubscribe = { t.interrupt }
    }
  })

  def getEpisodes(show: Show) = Observable.create((m: Observer[Episode]) => {
    val t = async {
      try {
        val url = s"http://tvcountdown.com/s/${show.url}?all"

        val source = new org.xml.sax.InputSource(url)
        val root = HTML5Parser.loadXML(source)

        var dates: Array[Option[Date]] = Array()

        val site = root.text
        val start = site.indexOf("timestamp")
        if (start > -1) {
          val line = site.substring(start, site.indexOf('\n', start))
          val timestamps = line.substring(line.indexOf('['), line.length - 2)
          //        19 September, 2011 21:00:00
          val format = new SimpleDateFormat("dd MMMM, yyyy HH:mm:ss")
          dates = mapper.readValue(timestamps, classOf[Array[String]]) map (_ match {
            case "" => None
            case d => Some(format.parse(d))
          })
        }

        val divs = root \\ "div"
        val episodes = divs.filter(ns => (ns \ "@class").text startsWith "sixteen columns bc_")

        for ((epDiv, i) <- episodes.view zipWithIndex) {
          if (epDiv.child.length > 2) {
            val number = parseNumber(epDiv.child(1).text)
            val name = epDiv.child(2).text

            val date = if (i < dates.length)
              dates(i).map(d => new Timestamp(d.getTime))
            else
              None

            m onNext Episode(show.id, number._1, number._2, Some(name), date)
          }
        }

        m.onCompleted
      } catch {
        case _: Throwable => m.onError _
      }
    }
    new Subscription() {
      override def unsubscribe = { t.interrupt }
    };
  })

  def parseNumber(s: String): (Int, Int) = {
    val numbers = """S(\d{2,})E(\d{2,})""".r
    try {
      val numbers(season, episode) = s
      return (season.toInt, episode.toInt);
    } catch {
      //TODO
      case a: Throwable =>
        {
          println(a)
        }
    }
    return (0, 0);
  }

  def parseDate(s: String) = {
    new Timestamp(2)
  }

  def async[F](f: => F) = {
    val t = new Thread(new Runnable() { def run() { f } })
    t.setDaemon(true)
    t.start
    t
  }
}
