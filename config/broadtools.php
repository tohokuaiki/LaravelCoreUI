<?php
return [
    'pagination' => [
        'perpage' => 20,
    ],
    'upload_file_limit' => [
        'max_file_size' => iniFilesizeStr(ini_get('upload_max_filesize'), true),
        'image' => [
            'extensions' =>  ['jpeg', 'jpg', 'png', 'gif'],
            'mimes' => ['image/jpeg', 'image/png', 'image/gif'],
        ],
        'file' => [
            'extensions' =>  ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'zip'],
            'mimes' => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/zip'],
        ]
    ]
];
