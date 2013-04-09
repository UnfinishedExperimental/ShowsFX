/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package org.example.scalajfx

import java.sql.Time
import java.sql.Timestamp
import java.util.Date
import scala.slick.driver.HsqldbDriver.simple._

case class Show(name:String, url:String, description:Option[String] = None, channel:Option[String] = None,
                country:Option[String] = None, runtime:Option[Time] = None, id:Int = -1)
{
  def merge(s:Show) = 
  {
    copy(description = description orElse s.description,
         channel = channel orElse s.channel,
         country = country orElse s.country,
         runtime = runtime orElse s.runtime)
  }
}

object Shows extends Table[Show]("SHOWS")
{
  def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)
  def name = column[String]("NAME")  
  def url = column[String]("URL")
  def description = column[Option[String]]("DESCRIPTION")
  def channel = column[Option[String]]("CHANNEL")
  def country = column[Option[String]]("COUNTRY")
  def runtime = column[Option[Time]]("RUNTIME")
  
  def * = name ~ url ~ description ~ channel ~ country ~ runtime  ~ id <> (Show, Show.unapply _)
  
  def byName(name:String)(implicit session: Session) = Query(Shows).filter(_.name is name).firstOption
  
  def save(s:Show)(implicit session: Session) = {
    if(s.id == -1){
      val toInsert = name ~ url
      val newID = toInsert returning id insert (s.name, s.url)
      s.copy(id = newID)
    }else{
      Query(Shows) filter(_.id === s.id) update(s)
      s
    }
  }
  
  def insertOrMerge(s:Show)(implicit session: Session):Show  = {
    var show = byName(s.name) getOrElse s
    
    if(s.id == -1){
      val toInsert = name ~ url
      val newID = toInsert returning id insert (s.name, s.url)
      s.copy(id = newID)
    }else{      
      val merged = show merge s
      Query(Shows) filter(_.id === s.id)update(merged)  
      merged
    }
  }
}

case class Episode(show:Int, season:Int, number:Int, name:Option[String] = None,
                   air:Option[Timestamp] = None, description:Option[String] = None, 
                   id:Int = -1)
{
  def aired = air.map(_ before Episodes.now).getOrElse(false)
  
  def merge(e:Episode) = 
  {
    copy(description = description orElse e.description,
         name = name orElse e.name,
         air = air orElse e.air)
  }
}

object Episodes extends Table[Episode]("EPISODES")
{
  def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)
  def showID = column[Int]("SHOW_ID")
  
  def season = column[Int]("SEASON")
  def number = column[Int]("NUMBER")
  def name = column[Option[String]]("NAME")
  def air = column[Option[Timestamp]]("AIR")
  def description = column[Option[String]]("DESCRIPTION")
    
  def pk = index("IDX_EP_NUMBER", (showID, season, number), unique = true)
  def show = foreignKey("SHOW_FK", showID, Shows)(_.id)
  
  def * = showID ~ season ~ number ~ name ~ air ~ description ~ id <> (Episode, Episode.unapply _)
  def toInsert = showID ~ season ~ number ~ name ~ air
  
  def save(e:Episode)(implicit session: Session) = {
    if(e.id == -1){
      val newID = toInsert returning id insert (e.show, e.season, e.number, e.name, e.air)
      e.copy(id = newID)
    }else{
      Query(Episodes) filter(_.id === e.id) update(e)
      e
    }
  }
  
  def insertOrMerge(e:Episode)(implicit session: Session):Episode  = {
    try{
      var episode = single(e.show, e.season, e.number) getOrElse e
    
      if(episode.id == -1){
        val newID = toInsert returning id insert (e.show, e.season, e.number, e.name, e.air)
        e.copy(id = newID)
      }else{      
        val merged = episode merge e
        Query(Episodes) filter(_.id === e.id) update merged  
        merged
      }
    }catch{
      case a:Throwable => a.printStackTrace;throw a
    }
  }
  
  def totalEpisodeNumber(ep:Episode) = 
  {
    (for{e <- Episodes if e.air < ep.air
         s <- e.show if s.id is ep.show} yield e).length
  }
  
  def ofShow(showID:Int) = Query(Episodes).filter(e => e.showID is showID)
  def ofSeason(show:Int, season:Int) = ofShow(show).filter(_.season is season)
  def single(show:Int, season:Int, number:Int)(implicit session: Session) = 
    ofSeason(show, season).filter(_.number is number).firstOption   
  def aired(show:Int) = ofShow(show).filter(e => e.air <= now)  
  def future(show:Int) = ofShow(show).filter(e => e.air > now)
  
  def now = new Timestamp(new Date().getTime)
}
