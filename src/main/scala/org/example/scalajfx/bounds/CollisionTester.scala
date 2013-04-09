package org.example.scalajfx.bounds

trait CollisionTester[-E <: Bounds, -T <: Bounds]
{
  def contains(a:E, b:T):Boolean
  def overlap(a:E, b:T):Boolean
}
