module.exports = function() {
	return new Promise((resolve, reject) => {
		const id = this.WebSocket.send("ssid", this.ssid)

		// console.log(id);

		this.WebSocket.getMessage("profile", message => {
			if (message.msg == false)
				return reject("Não foi possivel conectar.")
			
			console.log(message.msg['first_name']);
			console.log("primeiro nome está dentro do ./connect.js");
			// console.log(message.request_id)

			if (message.request_id == id) {
				for (const balance of message.msg.balances) {
					for (const instrumentType of ["digital-option", "binary-option", "turbo-option", "forex"]) {
						this.WebSocket.send("subscribeMessage", {
							name: "portfolio.position-changed",
							version: "2.0",
							params: {
								routingFilters: {
									user_id: balance.user_id,
									user_balance_id: balance.id,
									instrument_type: instrumentType
								}
							}
						})
					}
				}

				this.profile = message.msg
				this.connected = true
				return resolve()
			}
		})
	})
}