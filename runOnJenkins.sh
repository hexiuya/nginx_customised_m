docker stop nginx_customised_m
docker rm nginx_customised_m
docker image rm nginx_customised_m
docker build . -t nginx_customised_m
docker run -d -p 81:81 --name nginx_customised_m --network crm-network --network-alias alias-nginx-m nginx_customised_m
