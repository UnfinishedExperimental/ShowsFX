package org.example.scalajfx.bounds

import org.example.scalajfx.ditest.Point

case class AABB(center: Point[Float], halfSize: Point[Float]) extends Bounds {
  val maxRadius = halfSize.x max halfSize.y

  def outerCircle = CircleBound(center, halfSize.length)
  def innerCircle = CircleBound(center, halfSize.x min halfSize.y)
  
  def isInside(p:Point[Float]) = {
    val max = center + halfSize
    val min = center - halfSize
    p >= min && p <= max
  }
}
