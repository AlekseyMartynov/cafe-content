FROM buildpack-deps:stretch-curl

# https://yandex.ru/support/disk/cli-clients.xml#cli-install
# sudo removed
RUN echo "deb http://repo.yandex.ru/yandex-disk/deb/ stable main" \
    | tee -a /etc/apt/sources.list.d/yandex.list > /dev/null && wget http://repo.yandex.ru/yandex-disk/YANDEX-DISK-KEY.GPG -O- \
    | apt-key add - && apt-get update && apt-get install -y yandex-disk

ADD cmd.sh setup.sh /
RUN chmod +x /*.sh
