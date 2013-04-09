package org.example.scalajfx.bounds.tester

import org.example.scalajfx.bounds.CollisionTester
import org.example.scalajfx.bounds.AABB
import org.example.scalajfx.bounds.Bounds
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.bounds.CircleBound
import org.example.scalajfx.ditest.Point

object Tester {
  implicit object AABBvsAABB extends CollisionTester[AABB, AABB] {

    def contains(a: AABB, b: AABB) = {
      val delta = b.center - a.center
      (delta + b.halfSize) <= a.halfSize && (delta - b.halfSize) >= 0
    }

    def overlap(a: AABB, b: AABB) =
      {
        val delta = (b.center - a.center)(_.abs)
        delta <= (a.halfSize + b.halfSize)
      }
  }

  implicit object AABBvsCircle extends CollisionTester[AABB, CircleBound] {

    def contains(a: AABB, b: CircleBound) = {
      val delta = b.center - a.center
      (delta + b.radius) <= a.halfSize && (delta - b.radius) >= 0
    }

    def overlap(a: AABB, b: CircleBound): Boolean =
      {
        val circleDistance = (b.center - a.center)(_.abs)
        val w = a.halfSize + b.radius

        if (!(circleDistance <= w))
          return false

        if (!(circleDistance > a.halfSize))
          return true

        (circleDistance - a.halfSize).lengthSq <= b.radius * b.radius
      }
  }

  implicit object CircleVsAABB extends CollisionTester[CircleBound, AABB] {

    def contains(a: CircleBound, b: AABB) = {
      (b.center - a.center).lengthSq + b.halfSize.lengthSq <= a.radius * a.radius
    }

    def overlap(a: CircleBound, b: AABB) = {
      AABBvsCircle.overlap(b, a)
    }
  }

  implicit object CircleVsCircle extends CollisionTester[CircleBound, CircleBound] {

    def contains(a: CircleBound, b: CircleBound) = {
      (b.center - a.center).lengthSq + b.radius * b.radius <= a.radius * a.radius
    }

    def overlap(a: CircleBound, b: CircleBound) = {
      val r = a.radius + b.radius
      (b.center - a.center).lengthSq <= r * r
    }
  }

  def contains[E <: Bounds, T <: Bounds](a: E, b: T): Boolean = a match {
    case aa: AABB => contains(aa, b)
    case aa: CircleBound => contains(aa, b)
  }

  def contains[T <: Bounds](a: AABB, b: T) = b match {
    case aa: AABB => a contains aa
    case aa: CircleBound => a contains aa
  }

  def contains[T <: Bounds](a: CircleBound, b: T) = b match {
    case aa: AABB => a contains aa
    case aa: CircleBound => a contains aa
  }

  def overlap[E <: Bounds, T <: Bounds](a: E, b: T): Boolean = a match {
    case aa: AABB => overlap(aa, b)
    case aa: CircleBound => overlap(aa, b)
  }

  def overlap[T <: Bounds](a: AABB, b: T) = b match {
    case aa: AABB => a overlap aa
    case aa: CircleBound => a overlap aa
  }

  def overlap[T <: Bounds](a: CircleBound, b: T) = b match {
    case aa: AABB => a overlap aa
    case aa: CircleBound => a overlap aa
  }
}