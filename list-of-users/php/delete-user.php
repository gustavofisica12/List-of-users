<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

$id = $_POST['ID'];

try {
    $connection = new mysqli("localhost", "root", "", "list");
    $connection->set_charset('utf8');

    $statement = $connection->prepare("DELETE FROM `users` WHERE `ID` = ?");
    $statement->bind_param("s", $id);
    $statement->execute();

    $answer = [];

    if ($connection->affected_rows <= 0) {
        $answer = ['error' => true];
    }
    
} catch (Exception $e) {
    $answer = ['error' => true];
}