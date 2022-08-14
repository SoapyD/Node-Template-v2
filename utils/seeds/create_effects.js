

    exports.run = async() => {
        list = {
            model: "Effect"
            ,params: [
                {
                    name: "poison",
                    description: "apply poison to a unit that'll take it's toll over 3 turns",
                    life: 3,
                    value: 2,
                    chance: 0.25,
                },                
                {
                    name: "blunt",
                    description: "any enemy projectiles passing through this effect area will be less effective at wounding",
                    life: 3,
                    value: 4,
                    chance: 1,
                },
            ]
        }
        return Promise.all([databaseHandler.createData(list)]);
    }