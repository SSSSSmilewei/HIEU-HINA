# 判题沙箱：开源 go-judge（https://github.com/criyle/go-judge）加各语言的编译器和解释器。
# 运行时要 --privileged（go-judge 用 Linux 命名空间和 cgroup 隔离每次运行），只监听本机或内网。
FROM criyle/go-judge:latest AS gojudge

FROM node:20-bookworm
# 国内装包慢，换清华镜像；Python 3.11、gcc、g++ 基础镜像已经自带
RUN sed -i 's|deb.debian.org|mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list.d/debian.sources \
 && apt-get update \
 && apt-get install -y --no-install-recommends openjdk-17-jdk-headless sqlite3 \
 && rm -rf /var/lib/apt/lists/*
COPY --from=gojudge /opt/go-judge /opt/go-judge
# 沙箱里能看到的目录：在 go-judge 自带的配置上把 Java 21 换成 Debian 12 的 Java 17
COPY mount.yaml /opt/mount.yaml
WORKDIR /opt
EXPOSE 5050
ENTRYPOINT ["/opt/go-judge", "-http-addr", ":5050"]
