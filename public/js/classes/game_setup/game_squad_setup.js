

const game_squad_setup = class {
	constructor(options) {	
		
        this.scene = options.scene;
        this.parent = options.parent;
        
		this.unit_list = options.unit_list;
		this.forces = options.forces;
        this.tile_size = options.tile_size;
        
        this.runPlacement();
	}

    runPlacement = () => {
		//SETUP THE SQUADS IF THE GAME ISN'T BEING LOADED FROM A PREVIOUS SAVE
		if(gameCore.assets.units_preload.length === 0){
			this.placeSquads();	
		}else{
			this.reloadSquads();
		}        
    }

	placeSquads = () => {

		//LOOP THROUGH ALL FORCES
		this.forces.forEach((force, player) => {
			force.army.squads.forEach((squad_data, squad_id) => {
				let squad = squad_data.squad;

				//CHECK TO SEE IF ANY OF THE UPPGRADES NEED TO GET APPLIED TO ALL UNITS IN THE SQUAD
				let universal_upgrades = [];
				let single_upgrades = [];
				squad_data.upgrades.forEach((item) => {
					if(item.upgrade.upgrades_all_in_squad === false){
						single_upgrades.push(item.upgrade);
					}else{
						universal_upgrades.push(item.upgrade);
					}
				})  

				for(let i=0;i<squad_data.size; i++){
				// for(let i=0;i<2; i++){					

					let x = (12+(i*2));
					let y = (3 + (force.side * 3));					

					let core = {
						id: gameCore.assets.units.length,
						side: force.side, //this can be used if each side has multiple players
						player: player, //i, //this is the specific owner of the unit
						squad: squad_id, //this can be used for squad checks like unit cohesion
						
						angle: 0,
						x: x * this.tile_size,
						y: y * this.tile_size,
						tileX: x,
						tileY: y,												
						
						alive: false,
		
						killed_by: -1,
						in_combat: false,
						in_combat_with: [],
						
						// poison: false,
						// poison_caused_by: -1,
						// poison_timer: 0,
		
						moved: false,
						charged: false,		
						shot: false,
						fought: false,

						selected_gun: 0,
						selected_melee: 0,	
						
						path: [],
						is_moving: false,
						cohesion_check: true,
						targets: [],						
						fight_targets: [],						

					}


					let single_upgrade;
					if(single_upgrades.length > i){
						single_upgrade = single_upgrades[i];
						core.upgrade_id = i
					}


					this.addUnit({
						core: core,
						squad: squad,
						universal_upgrades: universal_upgrades,
						single_upgrade: single_upgrade
					})

				}
			})
		})
	}

	reloadSquads = () => {
		
		//	RESET ANY EXISTING UNITS AND BULLETS IF THERE ARE ANY
		if(gameCore.assets.bullets){
			gameCore.assets.bullets.forEach((bullet) => {
				bullet.kill();
			})
		}
		gameCore.assets.bullets = []

		if(gameCore.assets.units){
			gameCore.assets.units.forEach((unit) => {
				unit.kill();
			})
		}
		gameCore.assets.units = []		

		//RELOAD UNITS
		gameCore.assets.units_preload.forEach((core) => {

			let force = gameCore.assets.forces[core.player];
			let squad_data = force.army.squads[core.squad];
			let squad = squad_data.squad;

			//CHECK TO SEE IF ANY OF THE UPPGRADES NEED TO GET APPLIED TO ALL UNITS IN THE SQUAD
			let universal_upgrades = [];
			let single_upgrades = [];
			squad_data.upgrades.forEach((item) => {
				if(item.upgrade.upgrades_all_in_squad === false){
					single_upgrades.push(item.upgrade);
				}else{
					universal_upgrades.push(item.upgrade);
				}
			})  

			//THIS NEEDS TO BE LOOKED INTO AS UPGRADE_ID IS NOT LONGER SAVED
			let single_upgrade;
			if(core.upgrade_id !== -1){
				single_upgrade = single_upgrades[core.upgrade_id];
			}

			//UPGRADES, SINGLE AND UNIVERSAL NEED ADDING BACK IN

			if(core.alive === true){

				let c_unit = this.addUnit({
					loaded: true,
					core: core,
					squad: squad,
					universal_upgrades: universal_upgrades,
					single_upgrade: single_upgrade
				})		
				let created_unit = gameCore.assets.units[c_unit.core.id]

				created_unit.core.path = core.path;
				created_unit.core.targets = core.targets;
				created_unit.core.fight_targets = core.fight_targets;				
				
				if(created_unit.core.targets.length > 0){
					created_unit.drawTarget();
				}
				if(created_unit.core.fight_targets.length > 0){
					created_unit.drawFightTarget();
				}
				if(created_unit.core.path.length > 0){
					created_unit.resetColours();
				}
				
			}
		})		

		// console.log(gameCore.assets.units_preload[0].targets)
		// console.log(gameCore.assets.units[0].core.targets)	
		
		//RELOAD BARRIERS

        //KILL ALL BARRIERS
        if(gameCore.assets.barriers.length > 0){
            gameCore.assets.barriers.forEach((barrier) => {
                barrier.kill();
            })
        }
        gameCore.assets.barrier_preload.forEach((barrier_info) => {
            let unit = gameCore.assets.units[barrier_info.unit_origin_id];
            new barrier({
                unit: unit,
                scene: gameCore.current_scene,
                x: barrier_info.x, 
                y: barrier_info.y,
                life: barrier_info.life,
                barrier: barrier_info.barrier_class
            })
        })

		//RESET SELECTED UNIT
		clientSocketHandler.resetSelection({
			data: {
				selected_unit_id: gameCore.data.selected_unit
			}
		})

	}

	addUnit = (options) => {

		let armour_class = {...options.squad.armour};
		let gun_class = {...options.squad.gun};
		let melee_class = {...options.squad.melee};
		let unit_class = {...options.squad.unit};

		let special_rules = [];
		options.squad.special_rules.forEach((rule) => {
			special_rules.push(rule)
		})

		if(options.universal_upgrades) {
			options.universal_upgrades.forEach((upgrade) => {
				if(upgrade.armour){
					armour_class = {...upgrade.armour};
				}
				if(upgrade.gun){
					gun_class = {...upgrade.gun};
				}
				if(upgrade.melee){
					melee_class = {...upgrade.melee};
				}
				if(upgrade.unit){
					unit_class = {...upgrade.unit};
				}
				
				if(upgrade.spritesheet){
					unit_class.spritesheet = upgrade.spritesheet
				}
			})
		}	

		//OVERWRITE MULTIPLE UPGRADES WITH SINGLE SPECIFIC UPGRADE
		if(options.single_upgrade){
			let single_upgrade = options.single_upgrade;
			if(single_upgrade.armour){
				armour_class = {...single_upgrade.armour};
			}
			if(single_upgrade.gun){
				gun_class = {...single_upgrade.gun};
			}
			if(single_upgrade.melee){
				melee_class = {...single_upgrade.melee};
			}
			if(single_upgrade.unit){
				unit_class = {...single_upgrade.unit};
			}				
			
			if(single_upgrade.spritesheet){
				unit_class.spritesheet = single_upgrade.spritesheet
			}			
		}

		let cost = 0;
		cost += armour_class.cost;
		cost += gun_class.cost;
		cost += melee_class.cost;
		cost += unit_class.cost;		
		
		if(!options.loaded){
			options.core.health = unit_class.health
			options.core.cost = cost

			options.core.unit_class = unit_class._id
			options.core.armour_class = armour_class._id

			options.core.gun_class = []
			options.core.gun_class.push(gun_class._id)

			options.core.melee_class = []
			options.core.melee_class.push(melee_class._id)		
			
			options.core.special_rules = []
			options.core.special_rules = special_rules;

			options.core.movement = unit_class.movement
			options.core.size = unit_class.size
			options.core.sprite_offset = unit_class.sprite_offset			
								
		}


		let unit_data = {
			scene: this.scene,

			core: options.core,

			special_rules: special_rules,
			unit_class: unit_class,
			armour_class: armour_class,
			melee_class: melee_class,
			gun_class: gun_class,				
		}


		// this.unit_list.push(new unit(unit_data));
		let c_unit = new unit(unit_data)
		gameCore.assets.units.push(c_unit);

		return c_unit
	}


}

