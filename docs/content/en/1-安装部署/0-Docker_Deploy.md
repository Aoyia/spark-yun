---

title: "Docker Deployment"

---

### [Docker Hub Link](https://hub.docker.com/r/isxcode/zhiqingyun)

##### 1. Copy Configuration and Resource Files

```bash
mkdir -p /Users/ispong/zhiqingyun
docker run --name zhiqingyun -d isxcode/zhiqingyun
# Copy resource files
docker cp zhiqingyun:/var/lib/zhiqingyun /Users/ispong/zhiqingyun
# Copy configuration files
docker cp zhiqingyun:/etc/zhiqingyun/conf /Users/ispong/zhiqingyun
docker stop zhiqingyun
docker rm zhiqingyun
```

##### 2. Restart the Image

▪ `ADMIN_PASSWORD`: The password for the admin account, effective only when the project is started for the first time. Default password is `admin123`<br/>
▪ `LOG_LEVEL`: Set the log level, such as info, debug, error, etc. <br/>
▪ `ACTIVE_ENV`: Configuration file, default is `docker` <br/>
▪ `/var/lib/zhiqingyun`: Resource directory <br/>
▪ `/etc/zhiqingyun/conf`: Configuration file directory <br/>

```bash
docker run --restart=always \
    --name zhiqingyun\
    -e ADMIN_PASSWORD=admin123 \
    -e LOG_LEVEL=info \
    -e ACTIVE_ENV=docker \
    -v /Users/ispong/zhiqingyun/zhiqingyun:/var/lib/zhiqingyun \
    -v /Users/ispong/zhiqingyun/conf:/etc/zhiqingyun/conf \
    -p 8080:8080 \
    -d isxcode/zhiqingyun
```

##### 3. Access the Project

▪ Access URL: <http://localhost:8080> <br/>
▪ Admin Account: `admin` <br/>
▪ Admin Password: `admin123`

#### Configure MySQL Data Source (Optional)

> Modify the project configuration file

```bash
vim /Users/ispong/zhiqingyun/conf/application-docker.yml
```

```yml
server:
  port: 8080

spring:

  security:
    user:
      name: admin
      password: admin123

  jpa:
    database: mysql

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.199.146:30306/zhiqingyun_db
    username: root
    password: ispong123

  flyway:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.199.146:30306/zhiqingyun_db
    user: root
    password: ispong123
    locations: classpath:db/migration/mysql

logging:
  level:
    root: info

spark-yun:
  default-agent-port: 30177
  tmp-dir: /tmp

isx-app:
  use-port: true
  use-ssl: false
  resources-path: /var/lib/zhiqingyun
  docker-mode: true
```

> Restart the Docker Image

```bash
docker restart zhiqingyun
```
