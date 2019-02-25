#! /bin/bash

export PGPASSWORD='node_password'

echo "Configuring todolist DB"

dropdb -U node_user todolist
createdb -U node_user todolist

psql -U node_user todolist < ./bin/sql/item.sql

echo "Configured todolist"