---

title: "Startup Auto-Configuration"

---

> Implementing Zhiqingyun Auto-Startup on CentOS

##### Grant Execution Permissions to Script Files

```bash
chmod a+x /root/zhiqingyun/bin/start.sh
chmod a+x /root/zhiqingyun/bin/stop.sh
```

##### Configure Auto-Startup File

```bash
vim /usr/lib/systemd/system/zhiqingyun.service
```

> Configure the script path, PID file path, and startup user

```bash
[Unit]
Description=Zhiqingyun Service Unit Configuration
After=network.target

[Service]
Type=forking

ExecStart=/root/zhiqingyun/bin/start.sh --print-log="false"
ExecStop=/root/zhiqingyun/bin/stop.sh
ExecReload=/root/zhiqingyun/bin/start.sh --print-log="false"
PIDFile=/root/zhiqingyun/zhiqingyun.pid
KillMode=none
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

##### Load the Service

```bash
systemctl daemon-reload
```

##### Set Auto-Startup

```bash
systemctl enable zhiqingyun
```

##### Manage the Service

```bash
# Start Zhiqingyun
systemctl start zhiqingyun
# Check the status of Zhiqingyun
systemctl status zhiqingyun
# Stop Zhiqingyun
systemctl stop zhiqingyun
# Restart Zhiqingyun
systemctl restart zhiqingyun
```
