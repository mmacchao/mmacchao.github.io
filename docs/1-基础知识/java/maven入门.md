# maven入门

## maven的包找寻机制 

```xml
<!-- 父项目-->
<modules>
  <module>a-service</module>
  <module>b-service</module>
</modules>

<!-- b-service依赖a-service-->
<dependency>
  <groupId>com.example</groupId>
  <artifactId>a-service</artifactId>
  <version>1.0-SNAPSHOT</version>
</dependency>
```

这时构建 mvn package 父项目时，b-service 会直接用到 a-service/target/classes 的编译结果。

如果 a-service 没有在父 POM \<modules\> 里声明，
那么 b-service 会去 本地仓库 找 a-service-1.0-SNAPSHOT.jar。

如果本地也没有，就去远程仓库下载

这个问题非常关键 🚀，涉及到 **Spring Boot 服务启动** 和 **Maven 构建生命周期** 的区别。我们分情况看：

---

## 1. **启动 b-service 的方式不同，行为不同**

### 情况 A：你在父项目目录执行

```bash
mvn spring-boot:run -pl b-service
```

* `-pl` 表示只运行某个模块，但 **仍然在整个 reactor 中**（因为你在父项目执行）。
* 这时 Maven 会先确保 `a-service`（b 的依赖）已经编译。
* 所以：Maven 会 **自动编译 a-service（生成 target/classes）**，然后 `b-service` 在运行时直接用它。
* ✅ 不会去本地仓库找 `a-service.jar`。

---

### 情况 B：你在 **b-service 单独目录** 执行

```bash
mvn spring-boot:run
```

* 此时 reactor 里只有 b-service，不包含 a-service。
* Maven 会去本地仓库找 `a-service-1.0-SNAPSHOT.jar`。
* 如果本地仓库没有，就会报错：

  ```
  Could not resolve dependencies for project ... a-service:jar:1.0-SNAPSHOT
  ```
* ✅ 不会自动去编译 a-service。

---

### 情况 C：你直接用 IDEA/VSCode 启动

* 如果 IDE 配置了 **父项目**，那效果相当于 情况 A → 会触发依赖模块先编译。
* 如果 IDE 只导入了 b-service 单个模块，那效果相当于 情况 B → 会去本地仓库找。

---

## 2. **为什么会这样？**

* Maven 的 **reactor 构建** 机制规定：在一次构建中，如果有模块依赖另一个模块，会自动编译依赖模块，直接使用其 `target/classes`。
* 但是如果不在同一个 reactor 中，Maven 就只认仓库里的 jar 包，不会帮你“去另一个目录找源码再编译”。

---

## 3. **实际开发建议**

👉 如果 a-service 和 b-service 是**一起开发**的：

* 最好放在一个父项目（multi-module）里，用 reactor 自动编译。
* 启动 b-service 时，就能保证 a-service 是最新的代码。

👉 如果 a-service 是**相对独立的服务/库**：

* 你需要先 `cd a-service && mvn install`，把它打包进本地仓库，然后 b-service 才能正常运行。

---

✅ 结论：

* **在父项目 reactor 中启动 b-service** → 会自动编译 a-service 并使用结果。
* **单独在 b-service 模块中启动** → 不会编译 a-service，而是从本地仓库寻找 a-service.jar。

---

