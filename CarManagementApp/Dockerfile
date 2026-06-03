# Sử dụng Maven để build dự án
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download thư viện trước để cache
RUN mvn dependency:go-offline -B
COPY src ./src
# Build file WAR
RUN mvn clean package -DskipTests

# Sử dụng Tomcat 10 (vì dự án bạn dùng Jakarta EE 11 / Java 17)
FROM tomcat:10.1-jre17
# Xóa các app mặc định của Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*
# Copy file war vừa build vào Tomcat và đổi tên thành ROOT.war để chạy trực tiếp từ domain chính
COPY --from=build /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
