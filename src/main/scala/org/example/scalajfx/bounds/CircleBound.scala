package org.example.scalajfx.bounds

import org.example.scalajfx.ditest.Point

case class CircleBound(center:Point[Float], radius:Float) extends Bounds{
	val maxRadius = radius
	def axisBound = AABB(center, Point(radius, radius))
}