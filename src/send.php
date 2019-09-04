<?php

$allowedFields = array(
  'name' => array('required' => true),
  'email' => array('required' => true),
  'pageTitle' => array('required' => false)
);

$errors= array();
$values = array();
foreach($allowedFields as $field => $options) {
  if($options['required'] === true && !isset($_POST[$field])) {
    $errors[$field] = 'Is required field';
  } else {
    $values[$field] = (isset($_POST[$field]) ? htmlspecialchars(trim($_POST[$field])) : null);
  }
}

if(!empty($errors)) {
  die(
    json_encode($errors)
  );
}

$to = 'zota-ural@mail.ru';
$from = 'From: zota@inter-t.ru' . PHP_EOL;
$subject = 'Заявка с сайта zota.inter-t.ru';
$body = sprintf('Товар: %s; Имя: %s; Email: %s;', $values['pageTitle'], $values['name'], $values['email']);

if (filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
  if(mail($to, $subject, $body, $from)) {
    die(
      json_encode($values)
    );
  } else {
    die(
      json_encode(
        array(
          'error' => 'Mail is not working',
        )
      )
    );
  }
} else {
  die(
    json_encode(
      array(
        'error' => 'Validation failed',
      )
    )
  );
}
