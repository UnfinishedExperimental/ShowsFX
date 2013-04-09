package org.example.scalajfx.bounds

import org.example.scalajfx.ditest.Point
import org.example.scalajfx.bounds.tester.Tester

trait Bounds{
  val center: Point[Float]
  val maxRadius: Float
  
  def contains[T <: Bounds](o: T)(implicit tester:CollisionTester[this.type, T]):Boolean =
  {
    tester.contains(this, o)
  }
  
  def overlap[T <: Bounds](o: T)(implicit tester:CollisionTester[this.type, T]):Boolean =
  {
    tester.overlap(this, o)
  }
}