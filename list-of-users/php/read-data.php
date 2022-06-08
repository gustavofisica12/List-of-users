<?php

error_reporting(0);
header('Content-type: application/json; charset=utf-8');

try {
    $connection = new mysqli("localhost", "root", "", "list");

    $connection->set_charset("utf8");
    $statement = $connection->prepare("SELECT * FROM users");
    $statement->execute();
    $results = $statement->get_result();

    $answer = [];

    while ($row = $results->fetch_assoc()) {
        $user =  [
            'id' => $row['ID'],
            'name' => $row['name'],
            'lastName' => $row['last name'],
            'addres' => $row['addres'],
            'phone' => $row['phone']
        ];
        array_push($answer, $user);
    }
} catch (Exception $e) {
    $answer = [
        'error' => true
    ];
}

echo json_encode($answer);