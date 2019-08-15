<?php
$fio = $_POST['name'];
$email = $_POST['email'];
$fio = htmlspecialchars($fio);
$email = htmlspecialchars($email);
$fio = urldecode($fio);
$email = urldecode($email);
$fio = trim($fio);
$email = trim($email);
//echo $fio;
//echo "<br>";
//echo $email;


if (isset($fio) && isset($email) ) {

    if (mail("sibugol-ural@mail.ru", "Заявка с сайта", "Имя:".$fio.". E-mail: ".$email ,"From: sibugol@inter-t.ru \r\n"))
    {     echo "";
   } else {
       echo "";
   }

	// Формируем массив для JSON ответа
    $result = array(
    	'name' => $_POST["name"],
    	'phonenumber' => $_POST['email']
    );

    // Переводим массив в JSON
    echo json_encode($result);
}

?>