---

title: "Source Code Compilation"

---

#### Compilation Environment

▪ java-1.8 <br/>
▪ nodejs-18.14.2 <br/>

#### Source Code Download

```bash
git clone https://github.com/isxcode/spark-yun.git
```

#### Dependency Download

```bash
cd spark-yun
./gradlew install
```

#### Code Compilation

```bash
cd spark-yun
./gradlew clean package
```

#### Packaging Path

```bash
spark-yun/spark-yun-dist/build/distributions/zhiqingyun.tar.gz
```

#### Unpacking and Deployment

```bash
tar -vzxf zhiqingyun.tar.gz
bash zhiqingyun/bin/start.sh
```

#### Access the Project

▪ Access URL: <http://localhost:8080> <br/>
▪ Admin Account: `admin` <br/>
▪ Admin Password: `admin123`
