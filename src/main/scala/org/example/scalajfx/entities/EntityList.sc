

trait CacheModule {
  type Cache[K, V] <: CacheLike[K, V]

  def Cache[K, V]: Cache[K, V]

  trait CacheLike[K, V] {
    def get(k: K): V
    def set(k: K, v: V): Cache[K, V]
  }
}

trait MongoModule extends CacheModule {
  override def Cache[K, V] = new Cache[K, V]

  class Cache[K, V] extends CacheLike[K, V] {
    override def get(k: K): V = ???
    override def set(k: K, v: V): Cache[K, V] = ???
  }
}

trait RedisModule extends CacheModule {
  override def Cache[K, V] = new Cache[K, V]

  class Cache[K, V] extends CacheLike[K, V] {
    override def get(k: K): V = ???
    override def set(k: K, v: V): Cache[K, V] = ???
  }
}

trait Student
trait StudentRepositoryModule {
  type StudentRepository <: StudentRepositoryLike

  def StudentRepository: StudentRepository

  trait StudentRepositoryLike {
    def all: Seq[Student]
    def get(id: String): Option[Student]
  }
}

trait Teacher
trait TeacherRepositoryModule {
  type TeacherRepository <: TeacherRepositoryLike

  def TeacherRepository: TeacherRepository

  trait TeacherRepositoryLike {
    def all: Seq[Teacher]
    def get(id: String): Option[Teacher]
  }
}

trait one
trait two

trait PostgresStudentRepositoryModule extends StudentRepositoryModule {
  self: CacheModule with two =>

  override def StudentRepository = new StudentRepository

  class StudentRepository extends StudentRepositoryLike {
    override def all: Seq[Student] = ???
    override def get(id: String): Option[Student] = ???
  }
}

trait PostgresTeacherRepositoryModule extends TeacherRepositoryModule {
  // This module needs a CacheModule. Just as in the non-cake case, when
  // the TeacherRepository's constructor required a Cache instance, in
  // this case we declare our dependency on caching using a self-type.

  self: CacheModule with one =>

  override def TeacherRepository = new TeacherRepository

  class TeacherRepository extends TeacherRepositoryLike {
    override def all: Seq[Teacher] = ???
    override def get(id: String): Option[Teacher] = ???
  }
}

trait MySystem {
  self: StudentRepositoryModule with TeacherRepositoryModule =>
}

class Main {

  trait MongoOne extends MongoModule with one
  trait RedisTwo extends RedisModule with two

  def main(args: Array[String]): Unit = {
    val app = new MySystem with PostgresStudentRepositoryModule 
    with PostgresTeacherRepositoryModule 
    with MongoModule with one
    with RedisModule with two

  }
}