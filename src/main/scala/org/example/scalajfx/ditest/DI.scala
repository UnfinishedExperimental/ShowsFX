package org.example.scalajfx.ditest

import java.nio.file.Files
import java.nio.charset.Charset
import java.nio.file.Paths

trait Printer {
  def print(i: Int): String
}

trait Printer2 {
  def print(i: Int): String
}

trait PrinterComponet {
  val printer: Printer
}

trait Componet[T] {
  def component: T
}

class SimplePrinter extends Printer {
  def print(i: Int) = s"$i. Hello World!"
}

trait Office {
  def work: Unit
}

trait OfficeComponent {
  val office: Office
}

trait MyOfficeComponent extends OfficeComponent {
  this: Componet[Printer] =>

  class MyOffice extends Office {
    def work = for (i <- 1 until 10) println(component.print(i))
    def pr:Printer = component
  }
}
trait TestComponent {
  this: PrinterComponet =>

  val test:Test  
    
  class Test {
    def pr = printer
  }
}

//object Modul extends PrinterComponet with MyOfficeComponent with TestComponent{
//  val printer = new SimplePrinter
//  val office = new MyOffice
//  val test = new Test
//  
//  Files.readAllLines(Paths.get(""), Charset.defaultCharset())
//}
//
//object App {
//  val p1 = Modul.office.pr
//  val p2 = Modul.test.pr
//  
//  
//}
