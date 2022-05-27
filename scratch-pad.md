table: users

email:VARCHAR(255)
password: VARCHAR(255)
sequelize model:create --name user --attributes email:string,password:string

table: pets

name:VARCHAR(255)
age:INTEGER
species:VARCHAR(255)
sex:VARCHAR(255)
city:VARCHAR(255)
state:VARCHAR(255)
photo:VARCHAR(255)
sequelize model:create --name pet --attributes name:string,age:integer,species:string,sex:string,city:string,state:string,photo:string