FROM jetty:9.3.5-jre8

#build image wepage

RUN apt-get update --fix-missing \
	&& apt-get install -y --no-install-recommends \
	GraphicsMagick vim nginx-full net-tools php5 \
	&& rm -rf /var/lib/apt/lists/*

ENV mongo.host "$MONGO_PORT_27017_TCP_ADDR"
ENV mongo.port "$MONGO_PORT_27017_TCP_PORT"

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

ADD page /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/page /etc/nginx/sites-enabled/page

ADD jetty.xml /usr/local/jetty/etc/

ADD wepage-2.0.0.war /var/lib/jetty/webapps/

RUN mkdir -p /var/www/t && mkdir -p /var/www/wepage
ADD ./script /var/www/
ADD ./php /var/www/
ADD robots.txt /var/www/
RUN chown -R www-data:www-data /var/www

RUN mkdir -p /var/store/wepage/

VOLUME ["/var/store/wepage/"]

COPY docker-entrypoint.bash /

EXPOSE 8080
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.bash"]


