
    let base_roll_value = 20;

    exports.run = async() => {
        list = {
            model: "Effect"
            ,params: [
                {
                    name: "poison",
                    description: "apply poison to a unit that'll take it's toll over 3 turns",
                    effect_type: 'status',
                    sub_type: 'damage',
                    life: 3,
                    value: 1,
                    chance: 1 - (base_roll_value * 0.5),
                },                
                {
                    name: "blunt",
                    description: "any enemy projectiles passing through this effect area will be less effective at wounding",
                    effect_type: 'mod',
                    life: 3,
                    value: 4,
                    chance: 1 - (base_roll_value * 1),
                },
            ]
        }
        return Promise.all([databaseHandler.createData(list)]);
    }