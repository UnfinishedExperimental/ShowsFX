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
  
  def allShows(implicit session: Session) = Query(Shows).list
}

case class Episode(show:Int, season:Int, number:Int, name:Option[String] = None,
                   air:Option[Timestamp] = None, description:Option[String] = None, 
                   id:Int = -1)
{
  def aired = air.map(_ before Episodes.now).getOrElse(false)
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
    
  def save(e:Episode)(implicit session: Session) = {
    if(e.id == -1){
      val toInsert = showID ~ season ~ number ~ name ~ air
      val newID = toInsert returning id insert (e.show, e.season, e.number, e.name, e.air)
      e.copy(id = newID)
    }else{
      Query(Episodes) filter(_.id === e.id) update(e)
      e
    }
  }
  
  def totalEpisodeNumber(ep:Episode) = 
  {
    (for{e <- Episodes if e.air < ep.air
         s <- e.show if s.id === ep.show} yield e).length
  }
  
  def episodes(show:Show) = Query(Episodes).filter(e => e.showID === show.id)
  def episodesOfSeason(show:Show, season:Int) = episodes(show).filter(_.season === season)
  def episode(show:Show, season:Int, number:Int) = episodesOfSeason(show, season).filter(_.number === number)
  
  def airedEpisodes(show:Show) = episodes(show).filter(e => e.air <= now)  
  def futureEpisodes(show:Show) = episodes(show).filter(e => e.air > now)
  
  def now = new Timestamp(new Date().getTime)
}
