# This imports all the layers for "DropTicket_ticket_detail" into dropticket_ticket_detailLayers
Framer.Device.contentScale = 1.5
Framer.Device.deviceScale = 0.333333333

SCALEFACTOR = 2
STATUSBARHEIGHT = 25*SCALEFACTOR
ACTIONBARHEIGHT = 52*SCALEFACTOR
MARGIN = 8 * SCALEFACTOR
LABELHEIGHT = 24 * SCALEFACTOR
BOXHEIGHT = 80 * SCALEFACTOR

NUMBER_OF_TICKETS = 4
TICKET_CLOSED_HEIGHT = MARGIN*2+BOXHEIGHT
TICKET_OPEN_HEIGHT = 1280-STATUSBARHEIGHT-ACTIONBARHEIGHT*2-MARGIN*2
TICKET_WIDTH = 360*SCALEFACTOR-MARGIN*2
# Background, Import, Position and Animation Defaults –––––––––––––––––––
document.body.style.background = "#339bcb"

# This imports all the layers for "sourceproject.psd" into digipen_shopPsdLayers
psdLayers = Framer.Importer.load "imported/DropTicket_ticket_validation"

#psdLayers.root.center() #uncomment for browser centering
psdLayers.root.shadowY = 3
psdLayers.root.shadowBlur = 15
psdLayers.root.shadowColor = "rgba(0, 0, 0, 0.6)"
psdLayers.root.clip = true

material = require 'material'

Framer.Defaults.Animation = 
	curve: material.transformCurve
	time: 0.3

bus_text = ['Corsa semplice', 'Start Romagna', 'Durata: 1 ora 30 minuti']
parking_text = ["Sosta breve", "AMT Catania", "Durata: 1 ora"]
ztl_text = ["Accesso", "Centro urbano", "Durata: 90 minuti"]
bike_text = ["Corsa media", "GoBike", "Durata: 3 ore"]

Ticket = (type, ticketId) ->
	icons = [psdLayers["bus_icon"], psdLayers["parking_icon"], psdLayers["ztl_icon"], psdLayers["bike_icon"]]
	icons_expired = [psdLayers["bus_expired"], psdLayers["parking_expired"], psdLayers["ztl_expired"], psdLayers["bike_expired"]]
	texts = [bus_text, parking_text, ztl_text, bike_text]
	flatColors = ["#f2a832", "#2785e5", "#ec494c", "#49c80d"]
	expiredColors = ["#94876E", "#6E8093", "#949175", "#738C68"]
	textButtons = ["CONVALIDA", "CONVALIDA", "CONVALIDA", "CONVALIDA"]
	textSizes = ["36px", "28px", "24px"]
	textStyles = ["bold", "normal", "italic"]
	textColors = ["#000", "#888", "#888"]
	textOffsets = [0, LABELHEIGHT, BOXHEIGHT-LABELHEIGHT]
	textWeights = [500, 400, 400]
	
	ticket = new Layer
		x: MARGIN, y: ticketId*(MARGIN*3+BOXHEIGHT)+MARGIN
		width: TICKET_WIDTH, height: MARGIN*2+BOXHEIGHT
		backgroundColor: "#ffffff", borderRadius: 4 * SCALEFACTOR
		shadowY: 4, shadowBlur: 0, shadowColor: "rgba(0, 0, 0, 0.15)", name: "ticket"
	ticket.open = false
	ticket.ticketId = ticketId
	ticket.states.add
		maximized: {
			y: -> -(this.superLayer.y - MARGIN)
			height: TICKET_OPEN_HEIGHT
		}
	
	ticket.colorbox = new Layer
		superLayer: ticket,
		x: MARGIN, y: MARGIN, width: BOXHEIGHT, height: BOXHEIGHT, borderRadius: 2 * SCALEFACTOR,
		backgroundColor: flatColors[type]
	ticket.colorbox.states.add
		minimized: {width: BOXHEIGHT}
		maximized: {width: TICKET_WIDTH-MARGIN*2}
		expired: {backgroundColor: expiredColors[type]}
	
	ticket.icon = new Layer
		superLayer: ticket.colorbox,
		midX: BOXHEIGHT * 0.5, midY: BOXHEIGHT * 0.5,
		width: icons[type].width, height: icons[type].height
		image: icons[type].image
	ticket.icon.states.add
		hidden: { scale: 1, opacity: 0, midX: BOXHEIGHT * 0.5, midY: BOXHEIGHT * 0.5 }
		minimized: { scale: 0.5, midX: BOXHEIGHT * 0.75, midY: BOXHEIGHT * 0.75 }
		
	ticket.icon_expired = new Layer
		superLayer: ticket.colorbox,
		midX: BOXHEIGHT * 0.5, midY: BOXHEIGHT * 0.5,
		width: icons_expired[type].width, height: icons_expired[type].height
		image: icons_expired[type].image
	ticket.icon_expired.states.add
		minimized: { opacity: 0, scale: 0.5, midX: BOXHEIGHT * 0.75, midY: BOXHEIGHT * 0.75 }
	ticket.icon_expired.states.switchInstant "minimized"
	
	ticket.button = new Layer
		superLayer: ticket,
		borderRadius: 2 * SCALEFACTOR
		maxX: TICKET_WIDTH-MARGIN*2, y: MARGIN*2, width: 144, height: LABELHEIGHT+MARGIN,
	ticket.button.html = textButtons[type]		
	ticket.button.style =
		fontFamily: "Roboto", lineHeight: LABELHEIGHT+MARGIN*0.8+"px", textAlign: "center"
		fontSize: "24px", fontStyle: textStyles[i]
		fontWeight: 500, color: '#fff'
		background: flatColors[type], borderColor: "#fff"
		borderWidth: (1*SCALEFACTOR)+"px", borderStyle: "solid"
	ticket.button.states.add
		pressed: {opacity: 0.5}
		hidden: {scale:0, opacity:0}
	ticket.button.on Events.Click, (e) ->
		this.states.switchInstant "pressed"
		this.states.switch "default"
		ticket.validateTicket()
		e.cancelBubble = true
		
	ticket.bigButton = new Layer
		superLayer: ticket,
		borderRadius: 2 * SCALEFACTOR
		x: MARGIN, y: TICKET_OPEN_HEIGHT-MARGIN-LABELHEIGHT*2
		width: TICKET_WIDTH-MARGIN*2, height: LABELHEIGHT*2,
		backgroundColor: flatColors[type]
	ticket.bigButton.html = "CONVALIDA"
	ticket.bigButton.style =
		fontFamily: "Roboto", lineHeight: LABELHEIGHT*2+"px", textAlign: "center"
		fontSize: "36px", fontStyle: textStyles[i]
		fontWeight: 500, color: '#fff'
	ticket.bigButton.states.add
		pressed: {opacity: 0.5}
		hidden: {scale:0, opacity:0}
	ticket.bigButton.on Events.Click, (e) ->
		this.states.switchInstant "pressed"
		this.states.switch "default"
		ticket.validateTicket()
		e.cancelBubble = true
	
	ticket.texts = for textValue, i in texts[type]
		text = new Layer
			superLayer: ticket
			backgroundColor: "transparent"
			x: MARGIN*2 + ticket.colorbox.width, y: textOffsets[i]
			width: 360, height: LABELHEIGHT*1.5,
		text.html = textValue
		text.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: textSizes[i], fontStyle: textStyles[i],
			fontWeight: textWeights[i], color: textColors[i],
		text.states.add
			hidden: {opacity: 0}
		text
	ticket.whiteTexts = for textValue, i in texts[type]
		text = new Layer
			superLayer: ticket,
			backgroundColor: "transparent"
			x: MARGIN*2 + ticket.colorbox.width, y: textOffsets[i]
			width: 360, height: LABELHEIGHT * 1.5,
		text.html = textValue
		text.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: textSizes[i], fontStyle: textStyles[i],
			fontWeight: textWeights[i], color: 'white',
		text.states.add
			hidden: {opacity: 0}
		text.states.switchInstant "hidden"
		text
	
	ticket.progress = new Layer
		superLayer: ticket
		x: MARGIN*2 + ticket.colorbox.width, y: BOXHEIGHT-LABELHEIGHT+MARGIN
		width: ticket.width - MARGIN*4 - ticket.colorbox.width, height: 2*SCALEFACTOR
		backgroundColor: "#888"
	ticket.progress.states.add
		white: { brightness: 200 }
		
	ticket.qrCode = new Layer
		superLayer: ticket
		x:0, y:176, width:264, height:264,
		image: "https://chart.googleapis.com/chart?chs=264x264&cht=qr&chl=DropTicket&choe=UTF-8&chld=H"
	
	ticket.QRtexts = for lbl, i in ["ID", "Data di acquisto"]
		rowText = new Layer
			superLayer: ticket
			x: 256, y:176 + i*88 + 44, width: 408, height: 88,
			backgroundColor: "transparent"
		rowText.html = lbl
		rowText.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: "28px", fontStyle: "normal",
			fontWeight: 500, color: '#000', textAlign: "left"
		rowText
		
	ticket.QRtexts = for lbl, i in ["PotEjjrbxfPr7ya0o", "28 ago 17:28"]
		rowText = new Layer
			superLayer: ticket
			x: 256, y:176 + i*88 + 44, width: 408, height: 88,
			backgroundColor: "transparent"
		rowText.html = lbl
		rowText.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: "28px", fontStyle: "normal",
			fontWeight: 500, color: '#000', textAlign: "right"
		rowText
		
	ticket.textsDown = for lbl, i in ["Linea", "Check-in"]
		rowText = new Layer
			superLayer: ticket
			x: 32, y:440 + i*88, width: 408, height: 88,
			backgroundColor: "transparent"
		rowText.html = lbl
		rowText.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: "36px", fontStyle: "normal",
			fontWeight: 500, color: '#000', textAlign: "left"
		rowText
		
	ticket.textsDown = for lbl, i in ["A", "29 ago 12:24"]
		rowText = new Layer
			superLayer: ticket
			x: 32, y:440 + i*88, width: 632, height: 88,
			backgroundColor: "transparent"
		rowText.html = lbl
		rowText.style = 
			fontFamily: "Roboto", lineHeight: '88px',
			fontSize: "36px", fontStyle: "normal",
			fontWeight: 500, color: '#000', textAlign: "right"
		rowText
	
	ticket.on Events.StateWillSwitch, (prev, curr) ->
		fade.bringToFront()
		this.bringToFront()
		if prev is "default" and curr is "maximized"
			ticketGroup.draggable.enabled = false
			fade.states.switch "default"
			ticket.colorbox.states.switch "maximized"
			for t in ticket.texts
				t.states.switch "hidden"
			for t in ticket.whiteTexts
				t.states.switch "default"
			ticket.progress.states.switch "white"
		else if prev is "maximized" and curr is "default"
			ticketGroup.draggable.enabled = true
			fade.states.switch "hidden"
			ticket.colorbox.states.switch "minimized"
			for t in ticket.texts
				t.states.switch "default"
			for t in ticket.whiteTexts
				t.states.switch "hidden"
			ticket.progress.states.switch "default"
			
	ticket.on Events.Click, (e) ->
		ticket.states.next()
		
	ticket.validateTicket = () ->
		if ticket.button.states.state isnt "hidden"
			ticket.button.states.switch "hidden"
			ticket.bigButton.states.switch "hidden"
			ticket.states.switch "maximized"
			ticket.icon.states.switch "minimized"
			
			ripple = new Layer
				superLayer: ticket.colorbox
				midX: ticket.icon.midX, midY: ticket.icon.midY
				width: TICKET_WIDTH*2, height: TICKET_WIDTH*2
				scale: 0.001, opacity: 0.8
				borderRadius: TICKET_WIDTH, backgroundColor: "#ffffff"
			rippleAnim = new Animation({
				layer: ripple,
				properties: { scale: 1, opacity: 0 }, time: 1.5, repeat: 1000
			})
			rippleAnim.start()
			
			singleCheck = new Layer
				superLayer: ticket.colorbox, image: psdLayers["check_icon"].image,
				midX: ticket.icon.midX, midY: ticket.icon.midY
				width: psdLayers["check_icon"].width, height: psdLayers["check_icon"].height
			singleCheck.states.add
				hidden: { scale: 0, opacity: 0 }
			singleCheck.states.switchInstant "hidden"
			
			doubleCheck = new Layer
				superLayer: ticket.colorbox, image: psdLayers["double_check_icon"].image,
				midX: ticket.icon.midX, midY: ticket.icon.midY
				width: psdLayers["double_check_icon"].width, height: psdLayers["double_check_icon"].height
			doubleCheck.states.add
				hidden: { scale: 0, opacity: 0 }
			doubleCheck.states.switchInstant "hidden"
			
			singleCheck.states.switch "default"
			
			Utils.delay Utils.randomNumber(2, 3), ->
				singleCheck.states.switch "hidden"
				doubleCheck.states.switch "default"
				
			Utils.delay Utils.randomNumber(5, 7), ->
				doubleCheck.states.switch "hidden"
				ticket.icon.states.switch "hidden"
				ticket.icon_expired.states.switch "default"
				ticket.colorbox.states.switch "expired"
				rippleAnim.repeat = 0
				rippleAnim.on Events.AnimationEnd, -> rippleAnim.stop()
	ticket

#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
ticketGroup = new Layer
	superLayer: psdLayers["BG"]
	x: 0, y: 0
	width: 360*SCALEFACTOR, height: (TICKET_CLOSED_HEIGHT+MARGIN)*NUMBER_OF_TICKETS+MARGIN,
	clip: false
	backgroundColor: "transparent"
ticketGroup.draggable.enabled = true
ticketGroup.draggable.speedX = 0
ticketGroup.draggable.speedY = 1/SCALEFACTOR
ticketGroup.snapView = () ->
	snapfactor = (MARGIN*3+BOXHEIGHT)
	velocity = this.draggable.calculateVelocity()
	clampedVelocity = Math.max(-snapfactor, Math.min(velocity.y*100, snapfactor))
	this.targetY = Math.round((this.y+clampedVelocity)/snapfactor) * snapfactor
	this.targetY = Math.min(0, Math.max(this.targetY, -(this.height-psdLayers["BG"].height+MARGIN)))
	this.animate
		properties:
			y: this.targetY

ticketGroup.on Events.DragMove, () ->
	for l in this.subLayers
		l.ignoreEvents = true
ticketGroup.on Events.DragEnd, () ->
	this.snapView()
	for l in this.subLayers
		l.ignoreEvents = false
	
fade = new Layer
	superLayer: ticketGroup
	x: 0, y: 0, width: 360*SCALEFACTOR, height: 640*SCALEFACTOR
	backgroundColor: "rgba(0,0,0, 0.5)"
fade.states.add
	hidden: {opacity: 0}
fade.states.switchInstant "hidden"

fade.on Events.StateDidSwitch, (prev, curr) ->
	if prev is "default" and curr is "hidden"
		this.visible = false
	else if prev is "hidden" and curr is "default"
		this.visible = true
		
fade.on Events.StateWillSwitch, (prev, curr) ->
	if prev is "hidden" and curr is "default"
		this.visible = true
		
for i in [0..NUMBER_OF_TICKETS-1]
	ticketGroup.addSubLayer Ticket(i%4, i)