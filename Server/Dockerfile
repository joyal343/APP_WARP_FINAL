FROM openjdk:17-oracle
WORKDIR /
COPY . .
CMD  java -cp hsqldb-2.3.1.jar org.hsqldb.server.Server --database.0 file:mydb --dbname.0 testdb  &  java -classpath ".;AppWarpS2Server/*" Hello & wait

EXPOSE 3000