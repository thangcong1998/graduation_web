<?php

/**
 * Definition roles, modules & permissions.
 *
 * permission: [controllerName]_[actionName]. eg: user_index => UserController@index
 */
return [
    'modules' => [
        'user' => [
            'display_name' => 'Quản lý người dùng',
            'english_name' => 'User management',
            'permissions' => [
                'user_all' => [
                    'name' => 'Xem danh sách người dùng',
                    'english_name' => 'All users'
                ],
                'user_view' => [
                    'name' => 'Xem thông tin người dùng',
                    'english_name' => 'View user'
                ],
                'user_add' => [
                    'name' => 'Thêm người dùng',
                    'english_name' => 'Add user'
                ],
                'user_edit' => [
                    'name' => 'Cập nhật người dùng',
                    'english_name' => 'Edit user'
                ],
                'user_delete' => [
                    'name' => 'Xóa người dùng',
                    'english_name' => 'Delete user'
                ]
            ],
            'group' => '1'
        ],
        'role' => [
            'display_name' => 'Quản lý nhóm người dùng',
            'english_name' => 'Role management',
            'permissions' => [
                'role_all' => [
                    'name' => 'Xem danh sách nhóm người dùng',
                    'english_name' => 'All roles'
                ],
                'role_view' => [
                    'name' => 'Xem thông tin nhóm người dùng',
                    'english_name' => 'View role'
                ],
                'role_add' => [
                    'name' => 'Thêm nhóm người dùng',
                    'english_name' => 'Add role'
                ],
                'role_edit' => [
                    'name' => 'Cập nhật nhóm người dùng',
                    'english_name' => 'Edit role'
                ],
                'role_delete' => [
                    'name' => 'Xóa nhóm người dùng',
                    'english_name' => 'Delete role'
                ]
            ],
            'group' => '1'
        ],
        'country' => [
            'display_name' => 'Quản lý quốc gia',
            'english_name' => 'Country management',
            'permissions' => [
                'country_all' => [
                    'name' => 'Danh sách quốc gia',
                    'english_name' => 'All countries'
                ],
                'country_view' => [
                    'name' => 'Xem thông tin quốc gia',
                    'english_name' => 'View country'
                ],
                'country_edit' => [
                    'name' => 'Thay đổi thông tin quốc gia',
                    'english_name' => 'Edit country'
                ],
                'country_delete' => [
                    'name' => 'Xóa quốc gia',
                    'english_name' => 'Delete country'
                ],
            ],
            'group' => '3'
        ],
        'team' => [
            'display_name' => 'Quản lý đoàn tham dự',
            'english_name' => 'Team management',
            'permissions' => [
                'all_team' => [
                    'name' => 'Danh sách đoàn tham dự',
                    'english_name' => 'All teams'
                ],
                'team_view' => [
                    'name' => 'Xem thông tin đoàn tham dự',
                    'english_name' => 'View team'
                ],
                'team_edit' => [
                    'name' => 'Cập nhật đoàn tham dự',
                    'english_name' => 'Edit team'
                ],
                'team_delete' => [
                    'name' => 'Xóa đoàn tham dự',
                    'english_name' => 'Delete team'
                ]
            ],
            'group' => '3'
        ],
        'region' => [
            'display_name' => 'Quản lý đơn vị hành chính',
            'english_name' => 'Region management',
            'permissions' => [
                'region_all' => [
                    'name' => 'Danh sách đơn vị hành chính',
                    'english_name' => 'All region'
                ],
                'region_view' => [
                    'name' => 'Xem thông tin đơn vị hành chính',
                    'english_name' => 'View region'
                ],
                'region_edit' => [
                    'name' => 'Cập nhật đơn vị hành chính',
                    'english_name' => 'Edit team'
                ],
                'region_delete' => [
                    'name' => 'Xóa đơn vị hành chính',
                    'english_name' => 'Delete region'
                ]
            ],
            'group' => '3'
        ],
        'function_referee' => [
            'display_name' => 'Quản lý chức vụ trọng tài',
            'english_name' => 'Function referee management',
            'permissions' => [
                'function_referee_all' => [
                    'name' => 'Danh sách chức vụ trọng tài',
                    'english_name' => 'All function referee'
                ],
                'function_referee_add' => [
                    'name' => 'Thêm chức vụ trọng tài',
                    'english_name' => 'Add function referee'
                ],
                'function_referee_view' => [
                    'name' => 'Xem thông tin chức vụ trọng tài',
                    'english_name' => 'View function referee'
                ],
                'function_referee_edit' => [
                    'name' => 'Cập nhật chức vụ trọng tài',
                    'english_name' => 'Edit function referee'
                ],
                'function_referee_delete' => [
                    'name' => 'Xóa chức vụ trọng tài',
                    'english_name' => 'Delete function referee'
                ]
            ],
            'group' => '3'
        ],
        'foul' => [
            'display_name' => 'Quản lý danh mục lỗi',
            'english_name' => 'Foul management',
            'permissions' => [
                'foul_all' => [
                    'name' => 'Danh sách lỗi môn thi đấu',
                    'english_name' => 'All foul'
                ],
                'foul_add' => [
                    'name' => 'Thêm mới lỗi môn thi đấu',
                    'english_name' => 'Add foul'
                ],
                'foul_view' => [
                    'name' => 'Xem thông tin lỗi môn thi đấu',
                    'english_name' => 'View foul'
                ],
                'foul_edit' => [
                    'name' => 'Cập nhật thông tin lỗi môn thi đấu',
                    'english_name' => 'Edit foul'
                ],
                'foul_delete' => [
                    'name' => 'Xóa lỗi môn thi đấu',
                    'english_name' => 'Delete foul'
                ]
            ],
            'group' => '3'
        ],
        'sync_data' => [
            'display_name' => 'Quản lý đồng bộ',
            'english_name' => 'Synchronized data',
            'permissions' => [
                'sync_data_all' => [
                    'name' => 'Danh sách đồng bộ',
                    'english_name' => 'All synchronized data'
                ],
            ],
            'group' => '3'
        ],

        'register_management' => [
            'display_name' => 'Quản lý thành viên',
            'english_name' => 'Member management',
            'permissions' => [
                'register_management_all' => [
                    'name' => 'Danh sách thành viên',
                    'english_name' => 'All members'
                ],
                'register_management_view' => [
                    'name' => 'Xem thông tin thành viên',
                    'english_name' => 'View member'
                ],
                'register_management_edit' => [
                    'name' => 'Cập nhật thông tin thành viên',
                    'english_name' => 'Edit member'
                ],
                'register_management_delete' => [
                    'name' => 'Xóa thành viên',
                    'english_name' => 'Delete member'
                ],
            ],
            'group' => '4'
        ],
        'audit' => [
            'display_name' => 'Lịch sử thay đổi',
            'english_name' => 'Audit',
            'permissions' => [
                'audit_all' => [
                    'name' => 'Xem danh sách lịch sử thay đổi',
                    'english_name' => 'All audits'
                ]
            ],
            'group' => '2'
        ],
        'setting' => [
            'display_name' => 'Cài đặt',
            'english_name' => 'Setting',
            'permissions' => [
                'setting_edit' => [
                    'name' => 'Cập nhật thông tin cài đặt',
                    'english_name' => 'Edit setting'
                ]
            ],
            'group' => '2'
        ],
        'venue' => [
            'display_name' => 'Quản lý địa điểm thi đấu',
            'english_name' => 'Venue management',
            'permissions' => [
                'venue_all' => [
                    'name' => 'Danh sách địa điểm thi đấu',
                    'english_name' => 'All venues'
                ],
                'venue_add' => [
                    'name' => 'Thêm địa điểm thi đấu',
                    'english_name' => 'Add venues'
                ],
                'venue_view' => [
                    'name' => 'Xem thông tin địa điểm thi đấu',
                    'english_name' => 'View venue'
                ],
                'venue_edit' => [
                    'name' => 'Cập nhật địa điểm thi đấu',
                    'english_name' => 'Edit venue'
                ],
                'venue_delete' => [
                    'name' => 'Xóa địa điểm thi đấu',
                    'english_name' => 'Delete venue'
                ],
            ],
            'group' => '4'
        ],
        'sport' => [
            'display_name' => 'Quản lý môn thể thao',
            'english_name' => 'Sport management',
            'permissions' => [
                'sport_all' => [
                    'name' => 'Danh sách môn thể thao',
                    'english_name' => 'All sports'
                ],
                'sport_management' => [
                    'name' => 'Thêm, sửa, xóa môn thể thao',
                    'english_name' => 'Sport management'
                ]
            ],
            'group' => '3'
        ],
        'referee_management' => [
            'display_name' => 'Quản lý trọng tài',
            'english_name' => 'Referee management',
            'permissions' => [
                'referee_management_all' => [
                    'name' => 'Danh sách trọng tài',
                    'english_name' => 'All referees'
                ],
                'referee_management_add' => [
                    'name' => 'Thêm mới trọng tài',
                    'english_name' => 'Add referee'
                ],
                'referee_management_view' => [
                    'name' => 'Xem thông tin trọng tài',
                    'english_name' => 'View referee'
                ],
                'referee_management_add' => [
                    'name' => 'Thêm trọng tài',
                    'english_name' => 'Add referee'
                ],
                'referee_management_edit' => [
                    'name' => 'Cập nhật thông tin trọng tài',
                    'english_name' => 'Edit referee'
                ],
                'referee_management_delete' => [
                    'name' => 'Xóa trọng tài',
                    'english_name' => 'Delete referee'
                ],
            ],
            'group' => '4'
        ],
        'record_history' => [
            'display_name' => 'Quản lý lịch sử kỷ lục',
            'english_name' => 'Record history management',
            'permissions' => [
                'record_history_all' => [
                    'name' => 'Danh sách lịch sử kỷ lục',
                    'english_name' => 'All record history'
                ],
                'record_history_add' => [
                    'name' => 'Thêm mới lịch sử kỷ lục',
                    'english_name' => 'Add record history'
                ],
                'record_history_view' => [
                    'name' => 'Xem thông tin lịch sử kỷ lục',
                    'english_name' => 'View record history'
                ],
                'record_history_add' => [
                    'name' => 'Thêm lịch sử kỷ lục',
                    'english_name' => 'Add record history'
                ],
                'record_history_edit' => [
                    'name' => 'Cập nhật thông tin lịch sử kỷ lục',
                    'english_name' => 'Edit record history'
                ],
                'record_history_delete' => [
                    'name' => 'Xóa lịch sử kỷ lục',
                    'english_name' => 'Delete record history'
                ]
            ],
            'group' => '5'
        ],
        'congress_record' => [
            'display_name' => 'Quản lý kỷ lục đại hội',
            'english_name' => 'Congress record management',
            'permissions' => [
                'congress_record_all' => [
                    'name' => 'Danh sách kỷ lục đại hội',
                    'english_name' => 'All congress record'
                ],
                'congress_record_add' => [
                    'name' => 'Thêm mới kỷ lục đại hội',
                    'english_name' => 'Add congress record'
                ],
                'congress_record_view' => [
                    'name' => 'Xem thông tin kỷ lục đại hội',
                    'english_name' => 'View congress record'
                ],
                'congress_record_edit' => [
                    'name' => 'Cập nhật thông tin kỷ lục đại hội',
                    'english_name' => 'Edit congress record'
                ],
                'congress_record_delete' => [
                    'name' => 'Xóa kỷ lục đại hội',
                    'english_name' => 'Delete congress record'
                ]
            ],
            'group' => '5'
        ],
        'list_athletes' => [
            'display_name' => 'Quản lý đăng ký vận động viên',
            'english_name' => 'Register athletes management',
            'permissions' => [
                'list_athletes_all' => [
                    'name' => 'Danh sách vận động viên',
                    'english_name' => 'All list athletes'
                ],
                'list_athletes_management' => [
                    'name' => 'Thêm, sửa danh sách vận động viên',
                    'english_name' => 'List athletes management'
                ]
            ],
            'group' => '4'
        ],

        'stage' => [
            'display_name' => 'Quản lý vòng đấu',
            'english_name' => 'Stage management',
            'permissions' => [
                'stage_all' => [
                    'name' => 'Danh sách vòng đấu',
                    'english_name' => 'All list stage'
                ],
                'stage_view' => [
                    'name' => 'Xem thông tin vòng đấu',
                    'english_name' => 'View stage'
                ],
                'stage_edit' => [
                    'name' => 'Sửa vòng đấu',
                    'english_name' => 'Edit stage'
                ],
                'stage_delete' => [
                    'name' => 'Xóa vòng đấu',
                    'english_name' => 'Delete stage'
                ],
                'stage_add' => [
                    'name' => 'Thêm vòng đấu',
                    'english_name' => 'Add stage'
                ],
            ],
            'group' => '6'
        ],
        'match' => [
            'display_name' => 'Quản lý trận đấu',
            'english_name' => 'Match management',
            'permissions' => [
                'match_all' => [
                    'name' => 'Danh sách tr đấu',
                    'english_name' => 'All list match'
                ],
                'match_view' => [
                    'name' => 'Xem thông tin trận đấu',
                    'english_name' => 'View match'
                ],
                'match_edit' => [
                    'name' => 'Sửa trận đấu',
                    'english_name' => 'Edit match'
                ],
                'match_delete' => [
                    'name' => 'Xóa trận đấu',
                    'english_name' => 'Delete match'
                ],
                'match_add' => [
                    'name' => 'Thêm trận đấu',
                    'english_name' => 'Add match'
                ],
            ],
            'group' => '6'
        ],
        'competition_schedule' => [
            'display_name' => 'Quản lý lịch thi đấu',
            'english_name' => 'Competition schedule management',
            'permissions' => [
                'competition_schedule_all' => [
                    'name' => 'Danh sách lịch thi đấu',
                    'english_name' => 'All list competition schedule'
                ],
            ],
            'group' => '6'
        ],
        'match_result' => [
            'display_name' => 'Quản lý kết quả thi đấu',
            'english_name' => 'Match result management',
            'permissions' => [
                'match_result_all' => [
                    'name' => 'Danh sách kết quả thi đấu',
                    'english_name' => 'All list match result'
                ],
            ],
            'group' => '7'
        ],
        'medal_table' => [
            'display_name' => 'Quản lý bảng xếp hạng',
            'english_name' => 'Medal table management',
            'permissions' => [
                'medal_table_all' => [
                    'name' => 'Bảng xếp hạng',
                    'english_name' => 'Medal table'
                ],
                'medal_table_edit' => [
                    'name' => 'Sửa bảng xếp hạng',
                    'english_name' => 'Edit medal table'
                ],
            ],
            'group' => '9'
        ],
        // 'permission_sport' => [
        //     'display_name' => 'Quản lý theo môn thi đấu',
        //     'english_name' => 'Management according to the competition',
        //     'permissions' => [
        //         'Athletics' => [
        //             'name' => 'Athletics',
        //             'english_name' => 'Điền kinh'
        //         ]
        //     ],
        //     'group' => '8'
        // ]
    ],
    'roles' => [
        // role name => display_name, modules
        'admin' => [
            'display_name' => 'Quản trị viên',
            'modules' => [
                'user' => [
                    'user_all',
                    'user_add',
                    'user_view',
                    'user_edit',
                    'user_delete'
                ],
                'role' => [
                    'role_all',
                    'role_add',
                    'role_view',
                    'role_edit',
                    'role_delete'
                ],
                'audit' => [
                    'audit_all'
                ],
                'setting' => [
                    'setting_edit'
                ],
                'sport' => [
                    'sport_all',
                    'sport_management'
                ],
                'country' => [
                    'country_all',
                    'country_view',
                    'country_edit',
                    'country_delete'
                ],
                'team' => [
                    'all_team',
                    'team_view',
                    'team_edit',
                    'team_delete'
                ],
                'region' => [
                    'region_all',
                    'region_view',
                    'region_edit',
                    'region_delete'
                ],
                'function_referee' => [
                    'function_referee_all',
                    'function_referee_add',
                    'function_referee_view',
                    'function_referee_edit',
                    'function_referee_delete'
                ],
                'foul' => [
                    'foul_all',
                    'foul_add',
                    'foul_view',
                    'foul_edit',
                    'foul_delete'
                ],
                'sync_data' => [
                    'sync_data_all'
                ],
                'register_management' => [
                    'register_management_all',
                    'register_management_view',
                    'register_management_edit',
                    'register_management_delete'
                ],

                'venue' => [
                    'venue_all',
                    'venue_add',
                    'venue_view',
                    'venue_edit',
                    'venue_delete',
                ],

                'referee_management' => [
                    'referee_management_all',
                    'referee_management_view',
                    'referee_management_add',
                    'referee_management_edit',
                    'referee_management_delete'
                ],
                'record_history' => [
                    'record_history_all',
                    'record_history_add',
                    'record_history_view',
                    'record_history_add',
                    'record_history_edit',
                    'record_history_delete'
                ],
                'congress_record' => [
                    'congress_record_all',
                    'congress_record_add',
                    'congress_record_view',
                    'congress_record_edit',
                    'congress_record_delete'
                ],
                'list_athletes' => [
                    'list_athletes_all',
                    'list_athletes_management'
                ],
                'competition_schedule' => [
                    'competition_schedule_all'
                ],
                'stage' => [
                    'stage_all',
                    'stage_view',
                    'stage_edit',
                    'stage_delete',
                    'stage_add',
                ],
                'match' => [
                    'match_all',
                    'match_view',
                    'match_edit',
                    'match_delete',
                    'match_add',
                ],
                'match_result' => [
                    'match_result_all',
                ],
                'medal_table' => [
                    'medal_table_all',
                    'medal_table_edit'
                ],
            ]
        ]
    ]
];
