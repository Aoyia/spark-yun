---

title: "High Availability Deployment"

---

> Implementing Zhiqingyun High Availability Deployment Based on Alibaba Cloud with Load Balancing via Nginx

##### Resource Purchase

> Configuration: CentOS 7, 4 cores, 16GB memory

- ▪ Server 1: NFS shared disk service
- ▪ Disk: Mounted to Server 1
- ▪ Server 2: Nginx load balancing service
- ▪ Server 3: Install Zhiqingyun 1
- ▪ Server 4: Install Zhiqingyun 2
- ▪ Server 5: Install Zhiqingyun 3

| Server Name | Public IP        | Private IP        |
|-------------|------------------|------------------|
| Server 1    | 47.92.73.226      | 172.16.215.85     |
| Server 2    | 39.100.69.110     | 172.16.215.84     |
| Server 3    | 47.92.198.55      | 172.16.215.86     |
| Server 4    | 47.92.1.129       | 172.16.215.87     |
| Server 5    | 47.92.5.96        | 172.16.215.83     |

##### Mount Disk

Mount the disk to Server 1. Refer to the documentation: [Linux Mount Disk](https://ispong.isxcode.com/os/linux/linux%20%E6%8C%82%E8%BD%BD%E7%A3%81%E7%9B%98/)

##### Install NFS Service

Install NFS service on Server 1. Refer to the documentation: [Linux Install NFS Service](https://ispong.isxcode.com/os/linux/linux%20%E5%AE%89%E8%A3%85nfs%E6%9C%8D%E5%8A%A1/)

##### Mount Shared Disk

Mount the shared disk from Server 1 on Servers 3, 4, and 5. Refer to the documentation: [Linux Mount Shared Disk](https://ispong.isxcode.com/os/linux/linux%20%E6%8C%82%E8%BD%BD%E5%85%B1%E4%BA%AB%E7%A3%81%E7%9B%98/)

##### Install Zhiqingyun Service

Install Zhiqingyun service on Servers 3, 4, and 5. Refer to the documentation: [Zhiqingyun Installation Package Deployment](https://zhiqingyun.isxcode.com/docs/zh/1/2)

#### Note: Modify the configuration file to point the resource file directory to the shared disk

> Including: `spring.datasource.url` and `isx-app.resources-path`

```bash
vim zhiqingyun/conf/application-local.yml
```

```yaml
server:
  port: 8080

spring:

  security:
    user:
      name: admin
      password: admin1234

  datasource:
    driver-class-name: org.h2.Driver
    url: jdbc:h2:file:/data/zhiqingyun/h2/data;AUTO_SERVER=TRUE
    username: root
    password: root1234

isx-app:
  resources-path: /data/zhiqingyun
  admin-passwd: admin1234
  use-ssl: false
```

#### Note: Copy the default database driver files to the shared disk

> This only needs to be done once; no need to repeat the process

```bash
mkdir -p /data/zhiqingyun
cp -r zhiqingyun/resources/jdbc /data/zhiqingyun/
```

> Start the project

Start the Zhiqingyun service on all three servers

```bash
bash zhiqingyun/bin/start.sh
```

##### Install Nginx Load Balancing Service

Install Nginx load balancing service on Server 2. Refer to the documentation: [Nginx Load Balancing Configuration](https://ispong.isxcode.com/vue/nginx/nginx%20%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%85%8D%E7%BD%AE/)

##### Access Zhiqingyun via Nginx

▪ URL: <http://39.100.69.110> <br/>
▪ Account: admin <br/>
▪ Password: admin1234
