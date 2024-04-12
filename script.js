let maxBallCount = 20;
let minRadius = 10;
let maxRadius = 100;

function drawBalls() {
    let minRad = parseInt(document.getElementById('minRadius').value);
    let maxRad = parseInt(document.getElementById('maxRadius').value);
    let number = parseInt(document.getElementById('number').value);
    maxBallCount = number;
    minRadius = minRad;
    maxRadius = maxRad;
    startGame();    
}

function startGame() {

    const controlsElement = document.querySelector('.controls');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    // Görseli yükle
    const bubbleImage = new Image();
    bubbleImage.src = 'assets/bubble-white.png';
    const circleImage = new Image();
    circleImage.src = 'assets/circle0.png';
    const destroyImage = new Image();
    destroyImage.src = 'assets/circle.png';
    // Kelime array'i
    var wordsArray = ["CAT", "DOG", "SUN", "SKY", "HAT", "CAR", "BOX", "KEY", "ICE", "TEA", "JAM", "BEE", "OWL", "MAP", "PEN", "CUP", "BAG", "EGG", "BAT", "FOX", "LOVE", "TIME", "PLAY", "WORK", "HOME", "LAND", "SNOW", "RAIN", "TREE", "LAKE", "GOLD", "FISH", "BIRD", "MOON", "STAR", "FIRE", "CITY", "ROAD", "LIFE", "BOOK", "FOOD", "BLUE", "KING", "WOLF", "SHIP", "COLD", "WARM", "DARK", "MILK", "SAND", "LION", "BEAR", "RING", "WIND", "TAIL", "FROG", "ROCK", "HERB", "LEAF", "CLAY", "APPLE", "WATER", "LIGHT", "HOUSE", "OCEAN", "DREAM", "GREEN", "MUSIC", "CHAIR", "HEART", "SUGAR", "LAUGH", "MAGIC", "PEACE", "NIGHT", "TRAIN", "RIVER", "MONEY", "DANCE", "HONEY", "WORLD", "PLANT", "BEACH", "SOUND", "WATCH", "SPACE", "FIELD", "FRAME", "BREAD", "PARTY", "EAGLE", "METAL", "WHEAT", "LEMON", "TIGER", "TABLE", "GLASS", "STORM", "PIZZA", "SHELF"];
    var selectedWordsArray = [];
    // Rastgele kelime seçme
    var letters = selectRandomWordsAndCombine(20);
    var correctCounter = 0; // Silme işlemi için sayaç
    
    // Arkaplan görseli yükle
    const backgroundImage = new Image();
    backgroundImage.src = 'assets/background.png';
    // İmage nesnelerini saklamak için bir dizi oluşturun
    const platformImages = [];
    // Orange pane resmini diziye ekleyin
    platformImages.push(new Image());
    platformImages[0].src = 'assets/orange-pane.png';
    // Gray pane resmini diziye ekleyin
    platformImages.push(new Image());
    platformImages[1].src = 'assets/gray-pane.png';
    // Green pane resmini diziye ekleyin
    platformImages.push(new Image());
    platformImages[2].src = 'assets/green-pane.png';
    // Buton görsellerini saklamak için bir dizi oluşturun
    const buttonImages = [];
    // Silme görselini diziye ekleyin
    buttonImages.push(new Image());
    buttonImages[0].src = 'assets/cross.png'; // Silme görselinin yolu
    // Onaylama görselini diziye ekleyin
    buttonImages.push(new Image());
    buttonImages[1].src = 'assets/tick.png'; // Onaylama görselinin yolu
    
    // Platform konumu ve boyutları
    const platformHeight = 60;
    const platformWidth = canvas.width - 60;
    const platformY = canvas.height - (platformHeight * 2);
    const platformX = (canvas.width - platformWidth) / 2;
    
    let balls = [];
    let ballCount = 0;
    const addBallCount = Math.floor(Math.random() * 4) + 5;
    let ballCreationInterval = setInterval(createBall, 200);
    
    const handImage = new Image();
    handImage.src = 'assets/hand.png'; // El görselinin yolu
    let greetingTexts = ["TAP LETTERS TO MAKE WORDS", "LETTERS DON'T HAVE TO BE TOUCHING", "TAP THE GREEN BOX TO CONFIRM"];
    
    class Ball {
        constructor(x, y, radius, letter) {
            this.x = x;
            this.y = y;
            this.originalRadius = radius;
            this.radius = radius;
            this.letter = letter; // Topun üzerine yazılacak harf
            this.isSelected = false; // Topun seçilme durumu
            this.image = bubbleImage; // Başlangıçta kullanılacak görsel
            this.isBubble = true; // Başlangıçta top bubble olarak ayarlanır
            this.gravity = 0.2;
            this.velocityY = 0;
            this.velocityX = (Math.random() - 0.5) * 4;
            this.mass = 2; // Topların kütlesi
            this.letterColor = '#D76F48'; // Başlangıçta yazı rengi siyah
            this.isGrowing = false;
            this.growthRate = 0.5; // Büyüme hızı
            this.maxGrowth = radius * 1.2; // Maksimum büyüklük
            this.opacity = 1; // Topun opaklığı (1 tam opak, 0 tam saydam)
            this.isFadingOut = false; // Topun kaybolma durumu
        }
    
        fadeOut() {
            if (this.isFadingOut) {
                if (this.radius < this.maxGrowth) {
                    this.radius += this.growthRate; // Yarıçapı artır
                } 
                this.image = destroyImage;
                this.isBubble = !this.isBubble; // Durumu güncelle
                if (this.opacity > 0) {
                    this.radius += this.growthRate; // Büyüme efekti
                    this.opacity -= 0.02; // Opaklığı azalt
                } else {
                    this.opacity = 0; // Top tamamen saydam
                }
            }
        }
    
        draw() {
            ctx.globalAlpha = this.opacity; // Topun opaklığını ayarla
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            // Harfi çiz
            ctx.fillStyle = this.letterColor; // Yazı rengini ayarla
            ctx.font = 'bold 30px Sniglet-Regular'; // Harf fontu
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.letter, this.x, this.y);
            ctx.globalAlpha = 1; // Diğer çizimler için opaklığı sıfırla
        }
    
        update(balls) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
            this.x += this.velocityX;
    
            // Platforma çarpma kontrolü
            if (this.y + this.radius >= platformY) {
                this.y = platformY - this.radius; // Topu platformun üzerinde tut
                this.velocityY = -this.velocityY * 0.7; // Dikey hızın yönünü değştir ve enerji kaybını simüle et
                this.applyFriction(); // %30 hız kaybı
            }
    
            // Duvarlara çarpma kontrolü (yatay)
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                this.velocityX = -this.velocityX; // Yatay hızın yönünü değiştir
                this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius)); // Canvas içinde sınırla
            }
    
            // Yere çarpma ve sektirme kontrolü (dikey)
            if (this.y + this.radius >= canvas.height) {
                this.velocityY = -this.velocityY * 0.7; // Dikey hızın yönünü değiştir ve enerji kaybını simüle et
                this.y = Math.max(this.radius, Math.min(this.y, canvas.height - this.radius)); // Canvas içinde sınırla
            }
            // Topların yavaşladığını kontrol et ve durdur
            if (Math.abs(this.velocityX) < 0.2 && Math.abs(this.velocityY) < 0.2) {
                this.velocityX = 0;
                this.velocityY = 0;
            }
            // Diğer toplarla çarpışma kontrolü
            for (let i = 0; i < balls.length; i++) {
                if (this !== balls[i] && this.distance(this, balls[i]) < this.radius + balls[i].radius) {
                    this.resolveCollision(this, balls[i]);
                }
            }
    
            this.draw();
        }
    
        applyFriction() {
            this.velocityX *= 0.8; // Yatay hız için %30 azalma
            this.velocityY *= 0.8; // Dikey hız için %30 azalma
        }
    
        grow() {
            let growthAmount = this.growthRate * ((this.maxGrowth - Math.abs(this.radius - this.originalRadius)) / this.maxGrowth);
            growthAmount = Math.max(growthAmount, 0.3); // Minimum büyüme miktarını koru
    
            if (this.isGrowing) {
                if (this.radius < this.maxGrowth) {
                    this.radius += growthAmount; // Yarıçapı artır
                } else {
                    this.isGrowing = false; // Büyüme tamamlandı
    
                    // Görseli değiştir
                    if (this.isBubble) {
                        this.image = circleImage;
                        this.letterColor = '#EAC9A8'; // Text'in rengini değiştir
    
                    } else {
                        this.image = bubbleImage;
                        this.letterColor = '#D76F48'; // Text'in rengini değiştir
    
                    }
                    this.isBubble = !this.isBubble; // Durumu güncelle
                }
            } else {
                if (this.radius > this.originalRadius) {
                    this.radius -= growthAmount; // Yarıçapı azalt
                }
            }
    
            // Yarıçapın belirli bir eşik aralığında sabitlenmesini sağla
            if (Math.abs(this.radius - this.originalRadius) < 0.3) {
                this.radius = this.originalRadius; // Yarıçapı kesinlikle orijinal boyutuna ayarla
            }
        }
    
        // Çarpışma çözümleme fonksiyonu
        resolveCollision(ball1, ball2) {
            const xVelocityDiff = ball1.velocityX - ball2.velocityX;
            const yVelocityDiff = ball1.velocityY - ball2.velocityY;
    
            const xDist = ball2.x - ball1.x;
            const yDist = ball2.y - ball1.y;
    
            // Aynı yönde hareket eden topların çarpışmasını önleme
            if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
                const angle = -Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
    
                // Kütleleri kullanarak hızları sakla
                const m1 = ball1.mass;
                const m2 = ball2.mass;
    
                // Hızları döndür
                const u1 = this.rotate(ball1.velocityX, ball1.velocityY, angle);
                const u2 = this.rotate(ball2.velocityX, ball2.velocityY, angle);
    
                // Çarpışma sonrası hızları hesapla
                const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
                const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };
    
                // Hızları geri döndür
                const vFinal1 = this.rotate(v1.x, v1.y, -angle);
                const vFinal2 = this.rotate(v2.x, v2.y, -angle);
    
                ball1.velocityX = vFinal1.x;
                ball1.velocityY = vFinal1.y;
                ball2.velocityX = vFinal2.x;
                ball2.velocityY = vFinal2.y;
            }
    
            // Toplar birbirine çok yakınsa, birbirlerinden ittir
            if (this.distance(ball1, ball2) < ball1.radius + ball2.radius) {
                // Çarpışma noktasını bul
                const angle = Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
                const overlap = (ball1.radius + ball2.radius) - this.distance(ball1, ball2);
    
                // Topları çarpışma noktasından ittir
                ball1.x -= overlap * Math.cos(angle);
                ball1.y -= overlap * Math.sin(angle);
                ball2.x += overlap * Math.cos(angle);
                ball2.y += overlap * Math.sin(angle);
            }
    
            ball1.applyFriction(); // Çarpışma sonrası %30 hız azaltma
            ball2.applyFriction(); // Çarpışma sonrası %30 hız azaltma
        }
    
        // Mesafe hesaplama fonksiyonu
        distance(ball1, ball2) {
            const dx = ball1.x - ball2.x;
            const dy = ball1.y - ball2.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    
        isInsideBall(x, y) {
            // Tıklanan nokta ile topun merkezi arasındaki mesafeyi hesapla
            const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
            return distance < this.radius; // Mesafe topun yarıçapından küçükse, içinde demektir
        }
    
        // Hız vektörünü döndürme fonksiyonu
        rotate(velocityX, velocityY, angle) {
            return {
                x: velocityX * Math.cos(angle) - velocityY * Math.sin(angle),
                y: velocityX * Math.sin(angle) + velocityY * Math.cos(angle)
            };
        }
    }
    class Platform {
        constructor(canvas, ctx, assets, wordsArray) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.assets = assets;
            this.opacity = 1;
            this.fadeOutRate = 0.02;
            this.whichButton = '';
            this.currentPlatformImage = this.assets.platformImages[0];
            this.height = 60;
            this.width = this.canvas.width - 60;
            this.y = this.canvas.height - (this.height * 2);
            this.x = (this.canvas.width - this.width) / 2;
            this.wordsArray = wordsArray;
            this.selectedLetters = [];
        }
    
        drawBackground() {
            this.ctx.drawImage(this.assets.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    
        drawPlatform() {
            if (this.opacity > 0) {
                this.ctx.globalAlpha = this.opacity;
                this.ctx.drawImage(this.currentPlatformImage, this.x, this.y, this.width, this.height);
                this.ctx.globalAlpha = 1;
            }
        }
    
        drawButtonImage() {
            const selectImageX = this.width - 10;
            const selectImageY = this.y + 20;
            const selectImageWidth = 20;
            const selectImageHeight = 20;
            if (this.currentPlatformImage === this.assets.platformImages[1]) {
                this.whichButton = 'cancel';
                this.ctx.drawImage(this.assets.buttonImages[0], selectImageX, selectImageY, selectImageWidth, selectImageHeight);
            } else if (this.currentPlatformImage === this.assets.platformImages[2]) {
                this.whichButton = 'correct';
                this.ctx.drawImage(this.assets.buttonImages[1], selectImageX, selectImageY, selectImageWidth, selectImageHeight);
            }
        }
    
        checkAndUpdatePlatformImage(anyClicked) {
            const currentText = this.selectedLetters.map(item => item.letter).join('');
            if (this.wordsArray.includes(currentText)) {
                this.currentPlatformImage = this.assets.platformImages[2];
            } else {
                this.currentPlatformImage = anyClicked ? this.assets.platformImages[1] : this.assets.platformImages[0];
            }
        }
    
        isInsideButtonImage(x, y) {
            const selectImageX = this.width - 10;
            const selectImageY = this.y + 20;
            const selectImageWidth = 20;
            const selectImageHeight = 20;
    
            return x >= selectImageX && x <= selectImageX + selectImageWidth &&
                   y >= selectImageY && y <= selectImageY + selectImageHeight;
        }
    
        drawPlatformLetters() {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 30px Sniglet-Regular';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
    
            const lettersStr = this.selectedLetters.map(item => item.letter).join('');
            this.ctx.fillText(lettersStr, this.canvas.width - this.width, this.y + this.height / 2);
        }
    }
    class Tutorial {
        constructor(balls, canvas, ctx, handImage, greetingTexts, platform, circleImage) {
            this.balls = balls;
            this.canvas = canvas;
            this.ctx = ctx;
            this.handImage = handImage;
            this.greetingTexts = greetingTexts;
            this.platform = platform;
            this.showTutorial = false;
            this.greetingX = this.canvas.width;
            this.textIndex = 0;
            this.greetingDelay = 4000;
            this.greetingMoving = false;
            this.greetingEnd = false;
            this.handScale = 1;
            this.handScaleDirection = 1;
            this.handPulseSpeed = 0.005;
            this.handMaxScale = 1.1;
            this.handMinScale = 0.9;
            this.handPulse = true;
            this.lastSinValue = 0;
            this.isGoingUp = true;
            this.handOpacity = 1;
            this.fadeOutText = 'Tap!';
            this.fadeOutTextOpacity = 0;
            this.fadeOutTextStart = false;
            this.fadeOutTextIndex = 0;
            this.circleImage = circleImage;
        }
    
        // Diğer metodlar burada yer alacak...
        updateBalls() {
            this.balls = [...balls];
        }
    
        drawGreeting() {
            if(this.textIndex < 3) {
                // Yuvarlak köşeli dikdörtgen çiz
                this.ctx.fillStyle = '#8C6239'; // Arka plan rengi
                const rectX = this.greetingX; // Ortalama için ayarla
                const rectY = 40;
                const rectWidth = 300;
                const rectHeight = 50;
                const borderRadius = 25;
                this.roundRect(rectX - 150, rectY, rectWidth, rectHeight, borderRadius, true, false);
        
                // Gölge efekti
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;
                this.ctx.shadowBlur = 2;
                this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        
                // Yazıyı çiz
                this.ctx.fillStyle = 'white'; // Yazı rengi
                this.ctx.font = 'bold 18px Sniglet-Regular'; // Yazı fontu
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(this.greetingTexts[this.textIndex], rectX, rectY + rectHeight / 2);
                // Metni hedefe doğru hareket ettir
                
                if (this.greetingX > this.canvas.width / 2) {
                    this.greetingX -= 4; // Hız (pixel cinsinden)
                } else if (this.greetingX > -this.canvas.width / 2 && this.greetingEnd ) {
                    this.greetingX -= 4;
                } else if(this.greetingX <= -this.canvas.width / 2) {
                    if(this.textIndex != 1 || this.textIndex > 2) {
                        this.greetingX = this.canvas.width;
                        this.greetingEnd = false;
                        this.textIndex++;
                    }
                }
                
        
                // Gölgeyi sıfırla
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowBlur = 0;
                this.ctx.shadowColor = "transparent";
            }
            else {
                this.showTutorial = false;
            }
        }
    
        roundRect(x, y, width, height, radius, fill, stroke) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
            this.ctx.closePath();
            if (fill) {
                this.ctx.fill();
            }
            if (stroke) {
                this.ctx.stroke();
            }    }
    
        drawHand() {
            if (this.balls.length > 0 && this.handPulse) {
                const ball = this.balls[0];
                const now = performance.now();
                const sinValue = Math.sin(now * this.handPulseSpeed);
                const pulseSize = sinValue * (this.handMaxScale - this.handMinScale) / 2 + (this.handMaxScale + this.handMinScale) / 2;
                const drawWidth = ball.radius * 2 * pulseSize;
                const drawHeight = ball.radius * 2 * pulseSize;
                const drawX = ball.x - drawWidth / 2;
                const drawY = ball.y - drawHeight / 2;
                this.ctx.globalAlpha = this.handOpacity;
                // 'hand.png' görselini çiz
                this.ctx.drawImage(this.handImage, ball.x, ball.y, drawWidth, drawHeight);
                this.ctx.globalAlpha = 1; // Diğer çizimler için opaklığı sıfırla
        
                // Sinüs dalgasının yönünü kontrol et
                if (sinValue < this.lastSinValue && this.isGoingUp) {
                    const ballText = this.balls[this.fadeOutTextIndex];
                    // Sinüs dalgası azalmaya başladı, yani bir devir tamamlandı
                    this.startFadeOutTextAnimation(ballText.x, ballText.y); // Metnin başlangıç pozisyonunu topun hemen üzerinde ayarla
                    this.isGoingUp = false; // Yönü değiştir
                } else if (sinValue > this.lastSinValue && !this.isGoingUp) {
                    // Sinüs dalgası yükselmeye başladı, yönü tekrar değiştir
                    this.isGoingUp = true;
                }
                this.lastSinValue = sinValue; // Son sinüs değerini güncelle
            }
        }
    
        startFadeOutTextAnimation(x, y) {
            this.fadeOutTextX = x; // Metnin başlangıç Y pozisyonunu ayarla
            this.fadeOutTextY = y; // Metnin başlangıç Y pozisyonunu ayarla
            this.fadeOutTextOpacity = 1; // Opaklığı maksimum yap
            this.fadeOutTextStart = true; // Animasyonu başlat
        }
    
        drawFadeOutTextAnimation() {
            if (!this.fadeOutTextStart) return;
    
            const ball = this.balls[this.fadeOutTextIndex];
            // Görseli değiştir
            ball.image = this.circleImage;
            ball.letterColor = '#EAC9A8'; // Text'in rengini değiştir
            ball.isBubble = !this.isBubble; // Durumu güncelle
        
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeOutTextOpacity})`;
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.fadeOutText, this.fadeOutTextX, this.fadeOutTextY);
        
            this.fadeOutTextY -= 0.7; // Metni her karede biraz daha yukarı taşı
            this.fadeOutTextOpacity -= 0.005; // Opaklığı azalt
        
            if (this.fadeOutTextOpacity <= 0) {
                this.fadeOutTextStart = false; // Animasyonu durdur
            }
        }
    
        tutorial_word() {
            if(this.showTutorial) {
                // "Merhaba" yazısını çiz
                this.drawGreeting();
                this.drawHand();
        
                // Fade out metin animasyonunu çiz
                this.drawFadeOutTextAnimation();
            }    }
    
        checkBallClick(x, y) {
            if (this.balls.length > 0 && this.balls[this.fadeOutTextIndex].isInsideBall(x, y)) {
                // El animasyonunu kapat
                this.greetingEnd = true;
                this.handOpacity = 0;
                // Yazı animasyonunu balls[1]'in konumuna taşı
                if (this.balls.length > 1) {
                    this.startFadeOutTextAnimation(this.balls[1].x, this.balls[1].y - this.balls[1].radius);
                    if(this.fadeOutTextIndex + 1 < selectedWordsArray[0].length) {
                        this.fadeOutTextIndex++;
                    }
                    else {
                        this.greetingX = this.canvas.width;
                        this.greetingEnd = false;
                        this.textIndex++;
                        this.handPulse = false;
                    }
                }
            }
            
            if(this.platform.isInsideButtonImage(x, y)){
                this.greetingEnd = true;
            }    
        }
    }
    
    // Belirtilen sayıda rastgele kelime seçen ve bu kelimelerin tüm harflerini içeren bir array oluşturan fonksiyon
    function selectRandomWordsAndCombine(numWords) {
        // Verilen sayıda rastgele kelime seç
        var selectedWords = [];
        while (selectedWords.length < numWords) {
          var randomIndex = Math.floor(Math.random() * wordsArray.length);
          var selectedWord = wordsArray[randomIndex];
          if (!selectedWords.includes(selectedWord)) {
            selectedWords.push(selectedWord);
          }
        }
        selectedWordsArray = selectedWords;
      
        // Seçilen kelimelerin harf kombinasyonunu oluştur
        var combinedLetters = selectedWords.join('').split('');
        addWordsToControls(selectedWords);
        // Döndür
        return combinedLetters;
      }
    
    function removeBallsAndPlatformWithFadeOut() {
        balls.forEach((ball, index) => {
            setTimeout(() => {
                ball.isFadingOut = true;
            }, 100 * index); // Her top için 100 ms gecikme
        });
    }
    
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        var anyClicked = false;
    
        tutorial.checkBallClick(x, y); // Topa tıklanıp tıklanmadığını kontrol et
    
        // Ekstra görsel üzerinde tıklama kontrolü
        if (platform.isInsideButtonImage(x, y) && platform.whichButton == 'cancel') {
            balls.forEach(ball => {
                ball.isSelected = false;
                if(ball.image == circleImage) {
                    ball.isGrowing = true; // Topun büyümesini başlat
                }
                
            }); // Tüm topların seçimini kaldır
            platform.selectedLetters = []; // Seçilen harfleri temizle
            platform.checkAndUpdatePlatformImage(); // Platform görselini güncelle
            return; // Diğer tıklama kontrollerini engelle
        }
    
        // Silme görseli üzerinde tıklama kontrolü
        if (platform.isInsideButtonImage(x, y) && platform.whichButton == 'correct') {
            correctCounter++; // Sayaç artır
            if (correctCounter >= 4) {
                removeBallsAndPlatformWithFadeOut(); // FadeOut ile topları sil
                correctCounter = 0; // Sayaçı sıfırla
            } else {
                addNewBalls(); // Yeni toplar ekle
            }
            // Seçili topların fade out efektini başlat
            balls.forEach(ball => {
                if (ball.isSelected) {
                    ball.isFadingOut = true;
                }
            });
    
            // Seçilen harfleri temizle
            platform.selectedLetters = [];
            platform.checkAndUpdatePlatformImage(); // Platform görselini güncelle
            return; // Diğer tıklama kontrollerini engelle
        }
    
        balls.forEach((ball, index) => {
            if (ball.isInsideBall(x, y)) {
                ball.isGrowing = true; // Topun büyümesini başlat
    
                ball.isSelected = !ball.isSelected; // Topun seçim durumunu değiştir
                anyClicked = true; // Bir top seçildi
    
                if (ball.isSelected) {
                    platform.selectedLetters.push({ letter: ball.letter, index: index }); // Harfi ve topun indexini ekle
                } else {
                    // Harfi ve topun indexine göre çıkar
                    platform.selectedLetters = platform.selectedLetters.filter(item => !(item.letter === ball.letter && item.index === index));
                }
            }
            if(ball.image == circleImage)
            {
                anyClicked = true;
            }
        });
    
        // Platform görselini kontrol et ve gerekirse güncelle
        platform.checkAndUpdatePlatformImage(anyClicked);
    });
    
    // Yeni top oluşturma fonksiyonu
    function createBall() {
        if (ballCount >= maxBallCount)  {
            clearInterval(ballCreationInterval); // Max sayıya ulaşınca intervali durdur
        } else {
            let radius = Math.random() * (maxRadius - minRadius) + minRadius;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let ball = new Ball(x, 0, radius, letters[ballCount]);
            balls.push(ball);
            ballCount++;
            tutorial.updateBalls();
        }
    }
    
    function addNewBalls() {
        var numBalls = Math.floor(Math.random() * 4) + 5; // 5 ile 8 arasında rastgele sayı
        var ballsAdded = 0;
    
        var intervalId = setInterval(function() {
            if (ballsAdded < numBalls) {
                var radius = Math.random() * 30 + 20;
                var x = Math.random() * (canvas.width - radius * 2) + radius;
                balls.push(new Ball(x, 0, radius, letters[ballCount]));
                ballsAdded++;
                if(ballCount+1 >= letters.length) {
                    ballCount = 0;
                } else {
                    ballCount++;
                }
            } else {
                clearInterval(intervalId); // Top ekleme işlemi tamamlandı, interval'i durdur
            }
        }, 200); // Her 0.2ms'de bir top ekle
    }
    
    
    
    // Platform nesnesi
    const platform = new Platform(canvas, ctx, {
        backgroundImage: backgroundImage,
        platformImages: platformImages,
        buttonImages: buttonImages
        }, wordsArray);
        
    // Tutorial nesnesi
    const tutorial = new Tutorial(balls, canvas, ctx, handImage, greetingTexts, platform, circleImage);
    
    
    
    // Sayfanın yüklenme zamanını kaydet
    const startTime = Date.now();
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        platform.drawBackground();
    
        if (platform.opacity > 0) {
            platform.drawPlatform(); // Toplar varsa platformu çiz
            platform.drawPlatformLetters(); // Platform üzerindeki harfleri çiz
        }
        platform.drawButtonImage(); // Buton görselini çiz
        balls.forEach(ball => {
            ball.fadeOut();
            ball.grow();
            ball.update(balls);
        });
    
        // Geçen süreyi hesapla
        const elapsedTime = Date.now() - startTime;
    
        // Opaklık azaltma
        if (platform.opacity > 0 && balls.length == 0 && elapsedTime > 300) {
            platform.opacity -= platform.platformFadeOutRate;
        }    
        // Topların tamamen silinmesi
        balls = balls.filter(ball => ball.opacity > 0);
        // Belirli bir süre sonra "Merhaba" yazısını göster
        setTimeout(() => {
            tutorial.showTutorial = true;
            // 4 saniye sonra sadece bir kez çizim yapılması için animate dışında da çizim fonksiyonunu çağır
            tutorial.tutorial_word();
        }, 2000);
        tutorial.tutorial_word();
    }
        
    setInterval(createBall, 200);
    
    animate();
    
    // Dizi elemanlarını 'controls' elemanına ekleyen fonksiyon
    function addWordsToControls(words) {
        const listElement = document.createElement('p');
        words.forEach(word => {
            listElement.innerHTML += "['" + word + "'] ";
            listElement.style.color = "#8E8EA5";
        });
        controlsElement.appendChild(listElement);
    }
}