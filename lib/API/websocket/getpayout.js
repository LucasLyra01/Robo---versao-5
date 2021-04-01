module.exports = function(active) {
	return new Promise((resolve, reject) => {
		if (!(active in this.actives))
			return reject("Ativo inválido.")

        data = {
            "name": "price-splitter.client-price-generated",
            "version": "1.0",
            "params": {
                "routingFilters": {
                    "instrument_type": "digital-option",
                    "asset_id": this.actives[active]
                }
            }
        }

		const id = this.WebSocket.send("sendMessage", data);

        console.log("Entrei dentro do getpayout " + id);

		const callback = message => {
			if (message.request_id == id) {
				this.WebSocket.emitter.removeListener("unsubscribeMessage", callback)
				return resolve(message.msg.candles)
			}
		}

		this.WebSocket.getMessage("unsubscribeMessage", callback)
	})
}

// name = "unsubscribeMessage"

//     function __call__(self, asset_id){
//         data = {
//             "name": "price-splitter.client-price-generated",
//             "version": "1.0",
//             "params": {
//                 "routingFilters": {
//                     "instrument_type": "digital-option",
//                     "asset_id": int(asset_id)
//                 }
//             }
//         }

//         self.send_websocket_request(self.name, msg=data)
//     }