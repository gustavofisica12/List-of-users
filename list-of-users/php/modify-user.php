<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

$name = $_POST['namei'];
$name = filter_var($name, FILTER_SANITIZE_STRING);

$lastName = $_POST['lastName'];
$lastName = filter_var($lastName, FILTER_SANITIZE_STRING);

$addres = $_POST['addres'];
$addres = filter_var($addres, FILTER_SANITIZE_STRING);

$phone = $_POST['phone'];
$phone = filter_var($phone, FILTER_SANITIZE_STRING);

$id = $_POST['ID'];

function validateData($name, $lastName, $addres, $phone) {
    if ($name == '') {
        return false;
    } elseif ($lastName == '') {
        return false;
    } elseif ($addres == ''){
        return false;
    } elseif ($phone == '') {
        return false;
    } else {
        return true;
    }
}

if (validateData($name, $lastName, $addres, $phone)) {
    try {
        $connection = new mysqli("localhost", "root", "", "list");
        $connection->set_charset('utf8');

        $statement = $connection->prepare("UPDATE `users` SET `name`=?,`last name`=?,`addres`=?,`phone`=? WHERE `ID` = ?");
        $statement->bind_param("sssss", $name, $lastName, $addres, $phone, $id);
        $statement->execute();

        $answer = [];

        if ($connection->affected_rows <= 0) {
            $answer = ['error' => true];
        }
        
    } catch (Exception $e) {
        $answer = ['error' => true];
    }
} else{
    $answer = ['error' => true];
}

echo json_encode($answer);
