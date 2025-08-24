sudo docker stop bun-dev
sudo docker stop edu-zas-mariadb-dev

sudo docker rm bun-dev
sudo docker rm edu-zas-mariadb-dev

sudo rm -rf ./data/
sudo rm -rf ../node_modules/
sudo rm -rf ../api/node_modules/
sudo rm -rf ../client/node_modules/
