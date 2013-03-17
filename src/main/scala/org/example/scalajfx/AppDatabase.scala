/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package org.example.scalajfx

import scala.slick.driver.HsqldbDriver.simple._

trait AppDatabase {
  lazy val database = Database.forURL("jdbc:hsqldb:mem:testDB", user ="sa", password="", driver = "org.hsqldb.jdbcDriver")
}
