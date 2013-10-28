//package org.example.scalajfx.entities
//
//import shapeless._
//import scala.None
//
//object SuperConstraint {
//  import BasisConstraint._
//
//  type IsSuperOf[M <: HList, L <: HList] = BasisConstraint[M, L]
//
//  trait SuperRelation[N <: HList, M <: HList, L <: HList]
//
//  type Super[M <: HList] = {
//    type λ[L <: HList] = M IsSuperOf L
//  }
//
//  def prove[E, H <: HList, K <: HList, J <: HList](f: H IsSuperOf K => E)(implicit e2: J IsSuperOf K, e: SuperRelation[H, J, K]): E = f(new (H IsSuperOf K) {})
//
//  implicit def hlistSuperRelation[N <: HList, M <: HList, L <: HList](implicit e2: N IsSuperOf M, e1: M IsSuperOf L) = new SuperRelation[N, M, L] {}
//}
//
//object SuperConstraint2 {
//  import BasisConstraint._
//
//  type IsSuperOf[M <: HList, L <: HList] = BasisConstraint[M, L]
//
//  trait SuperRelation[+R, -B]
//
//  trait Test[+A]
//
//  type N = String :: HNil
//  type M = Int :: N with N
//  type P = Long :: M with M
//
//  val cc: Test[Any] = new Test[Int] {}
//
//  val b = new Test[Int :: N with N] {}
//  val a: Test[_ :: N with N] = b
//
//  def b[M, N <: HList] = {
//    new Test[M :: N with N] {}
//  }
//
//  def tryToInt(n: String) = try {
//    Some(n.toInt)
//  } catch {
//    case _ => None
//  }
//  
//  
//}
//
//object EntityList {
//
//  def main(args: Array[String]) {
//    testSuperConstraint
//  }
//
//  def testSuperConstraint {
//    type N = Int :: String :: HNil
//    type M = Boolean :: N
//
//    type Other = Double :: N
//
//    val nCompatible = 23 :: 13 :: "foo" :: "bar" :: HNil
//    val mCompatible = 'a' :: false :: nCompatible
//
//    import SuperConstraint._
//
//    def acceptM[L <: HList: Super[M]#λ](l: L) = {
//      //val a: Boolean = wrap { acceptOther(l)(_: Other IsSuperOf L) } //won't compile, because Other is no Super HList of M      
//
//      val b: Boolean = prove { acceptNExplicit(l) }
//      val c: Boolean = prove { acceptNImplicit(l)(_: N IsSuperOf L) }
//      c || b
//    }
//
//    def acceptNImplicit[L <: HList: Super[N]#λ](l: L) = true
//    def acceptNExplicit[L <: HList](l: L)(ev: N IsSuperOf L) = true
//
//    def acceptOther[L <: HList: Super[Other]#λ](l: L) = true
//
//    //acceptM(nCompatible)//won't compile because M is no Super HList of nCompatible
//    acceptM(mCompatible)
//
//    acceptOther(2.0 :: mCompatible)
//  }
//}