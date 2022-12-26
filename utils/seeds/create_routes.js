
    //  #####  ######  #######    #    ####### #######       ######  ####### #     # ####### #######  #####  
    // #     # #     # #         # #      #    #             #     # #     # #     #    #    #       #     # 
    // #       #     # #        #   #     #    #             #     # #     # #     #    #    #       #       
    // #       ######  #####   #     #    #    #####   ##### ######  #     # #     #    #    #####    #####  
    // #       #   #   #       #######    #    #             #   #   #     # #     #    #    #             # 
    // #     # #    #  #       #     #    #    #             #    #  #     # #     #    #    #       #     # 
    //  #####  #     # ####### #     #    #    #######       #     # #######  #####     #    #######  #####  

    exports.run = async() => {

        list = {
            model: 'DynamicRoute'
            ,params:
        [
            {
                model: 'Error',
                description: 'return a list of all recent server and client logged errors',
                sort: '{"created_date": "desc"}',
                index:[
                    {
                        column_width: 10,
                        column_name: 'Class',
                        value: ['class'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Function',
                        value: ['class'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Created_Date',
                        value: ['created_date'],
                        element_type: 'date',
                        readonly: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Detail',
                        value: ['detail'],
                        readonly: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Error',
                        value: ['e','message'],
                        readonly: 1
                    },
                    {
                        column_width: 40,
                        column_name: 'Stack',
                        value: ['e','stack'],
                        readonly: 1
                    }                                                 
                ] 
            },
            {
                model: 'Faction',
                description: 'return a list of all current factions',
                sub_data: ['Squad'],
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Naming',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Description',
                        value: ['description'],
                        element_type: 'textarea',
                        startrow: 1,
                        endrow: 1                
                    },
                    {
                        column_width: 20,
                        column_name: 'Squads',
                        value: ['squads'],
                        foreach: ['name'],
                        sub_data: 'Squad',
                        header: 'Composition',
                        startrow: 1,
                        endrow: 1 
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        readonly: 1,
                        startrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        readonly: 1,
                        endrow: 1 
                    }      
                ]     
            },
            {
                model: 'Squad',
                description: 'return a list of all current squads',
                sub_data: ['Unit','Gun','Melee','Armour','Upgrade','SpecialRule'],
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name and Size',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Min_Size',
                        edit_field_width: 2,
                        value: ['min_size']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Size',
                        value: ['max_size'],
                        edit_field_width: 2,
                        endrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Cost_Per_Unit',
                        value: ['cost_per_unit'],
                        header: 'Definition',
                        edit_field_width: 2,
                        startrow: 1,
                        endrow: 1,
                        readonly: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Unit',
                        sub_data: 'Unit',                
                        value: ['unit','name'],
                        startrow: 1,
                        element_type: 'select',
                    },
                    {
                        column_width: 10,
                        column_name: 'Gun',
                        sub_data: 'Gun',                
                        value: ['gun','name'],
                        element_type: 'select',                
                    },
                    {
                        column_width: 10,
                        column_name: 'Melee',
                        sub_data: 'Melee',                
                        value: ['melee','name'],
                        element_type: 'select',                
                    },
                    {
                        column_width: 10,
                        column_name: 'Armour',
                        sub_data: 'Armour',
                        value: ['armour','name'],
                        element_type: 'select',                
                        endrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Upgrades',
                        value: ['upgrades'],
                        foreach: ['name'],
                        sub_data: 'Upgrade',             
                        header: 'Upgrades and Special Rules',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Special_Rules',
                        value: ['special_rules'],
                        foreach: ['name'],          
                        sub_data: 'SpecialRule',
                        endrow: 1
                    }                                                      
                ]            
            },        
            {
                model: 'Unit',
                description: 'return a list of all current units',
                editable: 1,        
                index:[
                    {
                        column_width: 15,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Cost',
                        value: ['cost'],
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Shooting_Bonus',
                        value: ['shooting_bonus'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Fighting_Bonus',
                        value: ['fighting_bonus']
                    },
                    {
                        column_width: 5,
                        column_name: 'Health',
                        value: ['health']
                    },
                    {
                        column_width: 5,
                        column_name: 'Movement',
                        value: ['movement']
                    },
                    {
                        column_width: 5,
                        column_name: 'Cohesion',
                        value: ['cohesion']
                    },
                    {
                        column_width: 5,
                        column_name: 'Size',
                        value: ['size'],
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Sprite_Offset',
                        value: ['sprite_offset'],
                        header: 'Assets',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Spritesheet',
                        value: ['spritesheet']
                    },
                    {
                        column_width: 5,
                        column_name: 'Death-SFX',
                        value: ['death_sfx']
                    },
                    {
                        column_width: 10,
                        column_name: 'Symbol_ID',
                        value: ['symbol_id'],
                        endrow: 1
                    },
        
                    {
                        column_width: 10,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1
                    },            
                    {
                        column_width: 10,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1
                    }                                                            
                ]         
            },       
            {
                model: 'Gun',
                description: 'return a list of all current guns',
                sub_data: ['Barrier'],
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 5,
                        column_name: 'Range',
                        value: ['range']
                    },
                    {
                        column_width: 10,
                        column_name: 'Damage',
                        value: ['damage']
                    },
                    {
                        column_width: 10,
                        column_name: 'Amour_Piercing',
                        value: ['ap']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Targets',
                        value: ['max_targets']
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Radius',
                        value: ['blast_radius'],
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Spritesheet',
                        value: ['blast_spritesheet'],
                        header: 'Assets',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Barrier',
                        value: ['barrier','name'],
                        header: 'Barriers',
                        sub_data: 'Barrier',
                        element_type: 'select',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1,                
                    },
                    {
                        column_width: 10,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1,
                    }                                                      
                ]         
            },
            {
                model: 'Melee',
                description: 'return a list of all current melee weapons',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Range',
                        value: ['range']
                    },
                    {
                        column_width: 10,
                        column_name: 'Damage',
                        value: ['damage']
                    },
                    {
                        column_width: 10,
                        column_name: 'Amour_Piercing',
                        value: ['ap']
                    },
                    {
                        column_width: 10,
                        column_name: 'Max_Targets',
                        value: ['max_targets'],
                        endrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1
                    }                                                      
                ]         
            },
            {
                model: 'Armour',
                description: 'return a list of all current armour',
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Value',
                        value: ['value'],
                        endrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        readonly: 1,
                        startrow: 1
                    },
                    {
                        column_width: 20,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        readonly: 1,
                        endrow: 1
                    }                                                      
                ]         
            },
            {
                model: 'Upgrade',
                description: 'return a list of all current upgrades',
                sub_data: ['Unit','Gun'],
                editable: 1,        
                index:[
                    {
                        column_width: 20,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 30,
                        column_name: 'Description',
                        value: ['description'],
                        startrow: 1,
                        endrow: 1,                
                    },            
                    {
                        column_width: 10,
                        column_name: 'Cost',
                        value: ['cost'],
                        header: 'Stats',
                        startrow: 1,            
                    },
                    {
                        column_width: 10,
                        column_name: 'Upgrade_All',
                        value: ['upgrades_all_in_squad'],
                        endrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Unit',
                        value: ['unit','name'],
                        sub_data: 'Unit',
                        element_type: 'select',
                        header: 'Joins',
                        startrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Gun',
                        value: ['gun','name'],
                        sub_data: 'Gun',     
                        element_type: 'select',           
                        endrow: 1
                    }                                                        
                ]         
            },    
            {
                model: 'Barrier',
                description: 'return a list of all current barriers',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Descripion',
                        value: ['description'],
                        element_type: 'textarea',
                        startrow: 1,
                        endrow: 1,                
                    },
                    {
                        column_width: 10,
                        column_name: 'Life',
                        value: ['life'],
                        header: 'Stats',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Effects',
                        value: ['effects'],
                        startrow: 1,
                        endrow: 1,                
                    },            
                    {
                        column_width: 10,
                        column_name: 'Blast_Radius',
                        value: ['blast_radius'],
                        header: 'Assets',
                        startrow: 1
                    },
                    {
                        column_width: 10,
                        column_name: 'Blast_Sprite',
                        value: ['blast_sprite'],
                        endrow: 1
                    },
                    {
                        column_width: 15,
                        column_name: 'Created',
                        value: ['created_date'],
                        element_type: 'date',
                        header: 'Dates',
                        startrow: 1,
                        readonly: 1,
                    },
                    {
                        column_width: 15,
                        column_name: 'Updated',
                        value: ['updateddate'],
                        element_type: 'date',
                        endrow: 1,
                        readonly: 1,                
                    }                                                      
                ]         
            },
            {
                model: 'SpecialRule',
                description: 'return a list of all current special rules',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Descripion',
                        value: ['description'],
                        startrow: 1,
                        endrow: 1,
                        element_type: 'textarea'                
                    },                                                  
                ]         
            },    

            {
                model: 'Effect',
                description: 'return a list of all current effects',
                editable: 1,        
                index:[
                    {
                        column_width: 10,
                        column_name: 'Name',
                        value: ['name'],
                        header: 'Name',
                        startrow: 1,
                        endrow: 1,
                    },
                    {
                        column_width: 20,
                        column_name: 'Descripion',
                        value: ['description'],
                        startrow: 1,
                        endrow: 1,
                        element_type: 'textarea'                
                    },    
                    


                    {
                        column_width: 10,
                        column_name: 'Effect Type',
                        value: ['effect_type'],
                        header: 'Category',
                        startrow: 1,
                    },
                    {
                        column_width: 10,
                        column_name: 'Sub Type',
                        value: ['sub_type'],
                        endrow: 1,
                    },                    

                    {
                        column_width: 10,
                        column_name: 'Life',
                        edit_field_width: 2,
                        value: ['life'],

                        header: 'Values',
                        startrow: 1,                        
                    },                    
                    {
                        column_width: 10,
                        column_name: 'Value',
                        edit_field_width: 2,
                        value: ['value'],                 
                    },    
                    {
                        column_width: 10,
                        column_name: 'Hit Chance',
                        edit_field_width: 2,
                        value: ['chance'],

                        endrow: 1,                        
                    },                        

                ]         
            },   

            ]
        }
        return Promise.all([databaseHandler.createData(list)]);
    }