---

title: "Installation Package Deployment"

---

#### Recommended Installation Environment

▪ CentOS 7.9 <br/>
▪ AMD architecture CPU <br/>
▪ Java 1.8

#### Download the Installation Package

[-> Link at the bottom of the official website](https://zhiqingyun.isxcode.com)

![20240427182151](https://img.isxcode.com/picgo/20240427182151.png)

▪ [Installation Package Download Link](https://isxcode.oss-cn-shanghai.aliyuncs.com/zhiqingyun/zhiqingyun.tar.gz) <br/>
▪ [License Download Link](https://isxcode.oss-cn-shanghai.aliyuncs.com/zhiqingyun/license.lic)

#### Download and Unpack the Installation Package

```bash
wget https://isxcode.oss-cn-shanghai.aliyuncs.com/zhiqingyun/zhiqingyun.tar.gz
tar -vzxf zhiqingyun.tar.gz
```

#### Set Up Java Environment (Online Installation, Optional)

```bash
sudo yum install java-1.8.0-openjdk-devel java-1.8.0-openjdk -y 
```

#### Set Up Java Environment (Offline Installation, Optional)

> Download and Unpack Java

```bash
wget https://openfly.oss-cn-shanghai.aliyuncs.com/java/zulu8.78.0.19-ca-jdk8.0.412-linux_x64.tar.gz
tar -vzxf zulu8.78.0.19-ca-jdk8.0.412-linux_x64.tar.gz

# Configure JAVA_HOME
vim zhiqingyun/conf/zhiqingyun-env.sh
```

```bash
export JAVA_HOME=/root/zulu8.78.0.19-ca-jdk8.0.412-linux_x64
```

#### Change Admin Password

```bash
vim zhiqingyun/conf/application-local.yml
```

```yml
isx-app:
  admin-passwd: admin1234
```

#### Start the Project

```bash
bash zhiqingyun/bin/start.sh
```

#### Access the Project

▪ Access URL: <http://localhost:8080> <br/>
▪ Admin Account: `admin` <br/>
▪ Admin Password: `admin123` <br/>
