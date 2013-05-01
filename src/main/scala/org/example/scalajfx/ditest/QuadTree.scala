package org.example.scalajfx.ditest
import scala.collection.mutable.ArrayBuffer
import scala.util.Random
import org.example.scalajfx.bounds.AABB
import org.example.scalajfx.bounds.tester.Tester._
import org.example.scalajfx.bounds.Bounds
import scala.collection.mutable.LinkedList
import org.example.scalajfx.bounds.CircleBound
import scala.collection.mutable.ListBuffer
import scala.math.Integral
import scala.math.Fractional

case class Point[@specialized(Int, Float) T](x: T, y: T)(implicit num: Numeric[T]) {
  import num._
  @inline def *(v: Point[T]) = Point(x * v.x, y * v.y)
  @inline def *(v: T) = Point(x * v, y * v)
  @inline def -(o: Point[T]) = Point(x - o.x, y - o.y)
  @inline def -(o: T) = Point(x - o, y - o)
  @inline def +(o: Point[T]) = Point(x + o.x, y + o.y)
  @inline def +(o: T) = Point(x + o, y + o)
  @inline def <=(o: Point[T]) = x <= o.x && y <= o.y
  @inline def >=(o: T) = x >= o && y >= o
  @inline def >=(o: Point[T]) = x >= o.x && y >= o.y
  @inline def >(o: Point[T]) = x > o.x && y > o.y
  @inline def max = x max y
  @inline def toInt = Point(x.toInt, y.toInt)
  def apply[E](conv: T => E)(implicit n: Numeric[E]) = Point[E](conv(x), conv(y))
  @inline def length = Math.sqrt(lengthSq.toDouble).toFloat
  @inline def lengthSq = x * x + y * y
}

object Point {
  implicit class IntPoint[T](p: Point[T])(implicit num: Integral[T]) {
    import num._
    def /(v: T) = Point(p.x / v, p.y / v)
  }
}

object Node {
  def fromIndex(i: Int, tree: QuadTree) = {
    if (i == 0)
      Node(Point(0, 0), 0, tree)
    else {
      val d = QuadTree.maxDepth(i)
      val w = 1 << (d + 1)
      val li = i - QuadTree.nodeCount(d)
      Node(Point(li % w, li / w), d + 1, tree)
    }
  }

  def index(position: Point[Int], depth: Int) = {
    val offset = QuadTree.nodeCount(depth - 1)
    val l = 1 << depth
    offset + position.x + position.y * l
  }

  def looseBounds(position: Point[Int], depth: Int, tree: QuadTree) = {
    val l = tree.radius * 2 / (1 << depth)
    AABB(position(_.toFloat * l + l / 2), Point(l, l))
  }
}

case class Node(position: Point[Int], depth: Int, tree: QuadTree) {
  lazy val index = Node.index(position, depth)

  lazy val looseBounds = Node.looseBounds(position, depth, tree)

  val entities = new ListBuffer[Entity]

  lazy val children: Seq[Int] = {
    if (depth + 1 >= QuadTree.maxDepth)
      Nil
    else {
      val p = position * 2

      val offset = QuadTree.nodeCount(depth)
      val l = 1 << (depth + 1)

      val first = offset + p.x + p.y * l
      Seq(first, first + 1, first + l, first + 1 + l)
    }
  }

  def parent = {
    if (depth > 0)
      Option(Node.index(position / 2, depth - 1))
    else
      None
  }
}

trait Entity {
  val bound: Bounds
}

object QuadTree {

  def main(args: Array[String]) = TestMain.main(args)

  def nodeCount(maxDepth: Int) = ((1 << (maxDepth + 1) * 2) - 1) / 3
  def maxDepth(nodeCount: Int) = log2((3 * nodeCount + 1) / 4) / 2
  def log2(a: Int) = (Integer.SIZE - 1) - Integer.numberOfLeadingZeros(a)
  val maxDepth = 8
  val nodeCount: Int = nodeCount(maxDepth)
}

case class QuadTree(radius: Float) {

  private val nodes = Array.tabulate(QuadTree.nodeCount)(Node.fromIndex(_, this))

  private def root = nodes(0)

  def insert(e: Entity) = {
    val a = radius / e.bound.maxRadius
    val depth = QuadTree.log2(a.toInt) min (QuadTree.maxDepth - 1)

    var pos =
      if (depth > 0)
        e.bound.center * ((1 << depth - 1) / radius) toInt
      else
        Point(0, 0)

    var node = nodes(Node.index(pos, depth))

    if (depth + 1 < QuadTree.maxDepth) {
      val shift = e.bound.center - node.looseBounds.center
      val offset = shift(v => if (v > 0) 1 else 0)

      val np = pos * 2 + offset
      val n = nodes(Node.index(np, depth + 1))

      if (contains(n.looseBounds, e.bound))
        node = n
    }

    node.entities += e
    node
  }

  def clear = nodes foreach (_.entities.clear)

  def query(range: Bounds): Iterable[Entity] = {
    query(range, root)
  }

  private def query(b: Bounds, n: Node): Iterable[Entity] = {
    if (contains(b, n.looseBounds))
      n.entities ++ n.children.flatMap(nodes(_).entities)
    else if (overlap(n.looseBounds, b))
      n.entities.filter(e => contains(b, e.bound)) ++ n.children.flatMap(c => query(b, nodes(c)))
    else
      Seq()
  }

  def nearest(p: Point[Float], n: Int) = {
    val cell = p * ((1 << QuadTree.maxDepth - 1) / radius) toInt
    val node = nodes(Node.index(cell, QuadTree.maxDepth - 1))
  }
}

object TestMain {
  def main(args: Array[String]) = {
    val qt = QuadTree(10)

    case class En(bound: Bounds) extends Entity

    Thread.sleep(30000)

    for (i <- 0 to 5) {
      val ents = Array.tabulate(10000) { i =>
        val p = Point(Random.nextFloat * qt.radius * 2, Random.nextFloat * qt.radius * 2)
        val s = Point(Random.nextFloat * qt.radius / 2, Random.nextFloat * qt.radius / 2)
        En(AABB(p, s))
      }
      //      val ents2 = Array.tabulate(10000) { i =>
      //        val p = Point(Random.nextFloat * qt.radius * 2, Random.nextFloat * qt.radius * 2)
      //        val r = Random.nextFloat * qt.radius / 2
      //        En(CircleBound(p, r))
      //      }
      val time = System.currentTimeMillis
      ents.foreach(qt.insert(_))
      qt.clear
      //      ents2.foreach(qt.insert(_))
      println(System.currentTimeMillis - time)
    }

    val qs = Array.tabulate(500) { i =>
      val p = Point(Random.nextFloat * (qt.radius - 3) * 2 + 3, Random.nextFloat * (qt.radius - 3) * 2 + 3)
      val s = Point(Random.nextFloat * 5, Random.nextFloat * 3)
      AABB(p, s)
    }

    val qs2 = Array.tabulate(500) { i =>
      val p = Point(Random.nextFloat * (qt.radius - 3) * 2 + 3, Random.nextFloat * (qt.radius - 3) * 2 + 3)
      val r = Random.nextFloat * 5
      CircleBound(p, r)
    }

    for (i <- 0 to 5) {
      val time = System.currentTimeMillis
      qs.foreach(qt.query(_))
      qs2.foreach(qt.query(_))
      println(System.currentTimeMillis - time)
    }
  }
}
