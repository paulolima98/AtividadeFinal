var js = (function (window) {
	;
	var js = {
		topo: (function () {
			var el_frame = null;
			if (window.frames['FrameCorpo']) {
				el_frame = window;
			}
			else if (window.parent.frames['FrameCorpo']) {
				el_frame = window.parent;
			}
			else if (window.parent.parent.frames['FrameCorpo']) {
				el_frame = window.parent.parent;
			}
			else if (window.parent.parent.parent.frames['FrameCorpo']) {
				el_frame = window.parent.parent.parent;
			}
			else if (window.parent.parent.parent.parent.frames['FrameCorpo']) {
				el_frame = window.parent.parent.parent.parent;
			}
			return el_frame;
		}),
		is_string: (function (elemento) {
			return (typeof elemento === "string");
		}),
		is_integer: (function (elemento) {
			return ((+elemento === elemento) && (isFinite(elemento) == true));
		}),
		is_float: (function (elemento) {
			return (+elemento === elemento) && ((isFinite(elemento) == false) || !!(elemento % 1));
		}),
		is_array: (function (element) {
			return element.constructor === Array;
		}),
		is_object: (function (element) {
			return element.constructor === Object;
		}),
		integer: (function (elemento) {
			var temporaria;
			if ((elemento === true) || (elemento === false)) {
				return +elemento;
			}
			else if (js.is_string(elemento) === true) {
				temporaria = parseInt(elemento, 10);
				return ((isNaN(temporaria) == true) || (isFinite(temporaria) == false)) ? 0 : temporaria;
			}
			else if ((js.is_integer(elemento) == true) || (js.is_float(elemento) == true)) {
				return parseInt(elemento, 10);
			}
			else {
				return 0;
			}
		}),
		float: (function (elemento) {
			elemento = js.string(elemento);
			if ((elemento.indexOf('.') >= 0) && (elemento.indexOf(',') >= 0)) {
				elemento = js.replace('.', '', elemento);
			}
			elemento = elemento.replace(',', '.');
			return (parseFloat(elemento) || 0);
		}),
		percentage: (function (elemento) {
			elemento = js.float(elemento);
			if (elemento > 0) {
				return elemento / 100;
			}
			return 0;
		}),
		string: (function (elemento) {
			if (typeof elemento == 'boolean') {
				if (elemento === true) {
					return 'true';
				}
			}
			else if (typeof elemento == 'object') {
				return 'Objeto';
			}
			else if (elemento != null) {
				return String(elemento);
			}
			else {
				return '';
			}
		}),
		digit: (function (element) {
			return element.replace(/[^0-9]/g, '');
		}),
		date: (function (format) {
			var data = new Date();
			var textoData = '';
			textoData = js.replace('d', js.left(String(data.getDate()), 2, '0'), format);
			textoData = js.replace('m', js.left(String(data.getMonth() + 1), 2, '0'), textoData);
			textoData = js.replace('Y', String(data.getFullYear()), textoData);
			textoData = js.replace('H', js.left(String(data.getHours()), 2, '0'), textoData);
			textoData = js.replace('i', js.left(String(data.getMinutes()), 2, '0'), textoData);
			textoData = js.replace('s', js.left(String(data.getSeconds()), 2, '0'), textoData);
			textoData = js.replace('u', js.left(String(data.getMilliseconds()), 3, '0'), textoData);
			return textoData;
		}),
		date_create: (function (data) {
			var campos_data = data.split('/');
			var date = null;
			if (campos_data.length != 3) {
				return false;
			}
			campos_data = campos_data.map(function (item) {
				return js.integer(item);
			});
			date = new Date(campos_data[2], campos_data[1] - 1, campos_data[0], 0, 0, 0, 0);
			return date;
		}),
		replace: (function (search, replace, data, sensivel) {
			if (sensivel === void 0) { sensivel = false; }
			var searchList = [js.string(search)];
			var replaceList = [js.string(replace)];
			var text = js.string(data);
			if (sensivel === true) {
				for (var i = 0; i < searchList.length; i++) {
					text = text.split(searchList[i]).join(replaceList[i]);
				}
			}
			else {
				var escapeRegex = function (str) {
					return str.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
				};
				while (searchList.length > replaceList.length) {
					replaceList[replaceList.length] = '';
				}
				for (var i = 0; i < searchList.length; i++) {
					text = text.replace(new RegExp(escapeRegex(searchList[i]), 'gi'), replaceList[i]);
				}
			}
			return text;
		}),
		repeat: (function (preencher, len) {
			return new Array(len + 1).join(preencher);
		}),
		left: (function (value, quantidade, preenchimento) {
			return String(value).padStart(quantidade, preenchimento);
		}),
		right: (function (value, quantidade, preenchimento) {
			return String(value).padEnd(quantidade, preenchimento);
		}),
		number_format: (function (numero, decimais = 2, decimal = ',', milhar = '') {
			if (decimais === void 0) { decimais = 2; }
			if (decimal === void 0) { decimal = ','; }
			if (milhar === void 0) { milhar = ''; }
			var arr = [];
			
			let aux = '';
			numero = js.float(numero); // converte o numero para float para realizar os calculos
			numero = js.arredondar(numero,'',0,decimais);
			numero = numero.toString(); // retorna para string para trabalhar com os decimais e etc.
			

			// verifica se o número contém o "." ou se é um número inteiro que não possuirá
			if (!String(numero).includes('.')){
				aux = '0';
			}
			arr = numero.split('.');    // separa a partir do ponto, para tratar a pontuação
			
			if (arr[0] > 3) {
				var resultado = [];
				var num = arr[0].split('').reverse();
				for (var i = 0; i < num.length; i++) {
					if ((i % 3 == 0) && (i >= 3)) {
						resultado.push(milhar);
					}
					resultado.push(num[i]);
				}
				arr[0] = resultado.reverse().join('');
			
				if (numero < 0) {
					arr[0] = '-' + arr[0];
				}
			}
			// verifica se possui decimais, para retornar com eles
			if (decimais > 0) {
				// verifica se o "auxiliar" recebeu algum conteúdo para poder adicionar os "0" em um inteiro
				if (aux != ''){
					arr.push(aux);
				}
				// preenche todas as casas de acordo com os decimais informados
				arr[1] = arr[1].padEnd(decimais,'0');
				return arr[0] + decimal + (arr[1] + '').substr(0, decimais);
			}
			
			return arr[0];
		}),
		cpf_cnpj : (function(cpf_cnpj) {
			let isCPF = (cpf_cnpj).length == 11 ? true : false;

			if (cpf_cnpj.length == 11) {
				cpf_cnpj=cpf_cnpj.replace(/\D/g,"")
				cpf_cnpj=cpf_cnpj.replace(/(\d{3})(\d)/,"$1.$2")
				cpf_cnpj=cpf_cnpj.replace(/(\d{3})(\d)/,"$1.$2")
				cpf_cnpj=cpf_cnpj.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
				return cpf_cnpj
			} else if (cpf_cnpj.length == 14) {
				cpf_cnpj=cpf_cnpj.replace(/\D/g,"")
				cpf_cnpj=cpf_cnpj.replace(/^(\d{2})(\d)/,"$1.$2")
				cpf_cnpj=cpf_cnpj.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
				cpf_cnpj=cpf_cnpj.replace(/\.(\d{3})(\d)/,".$1/$2")
				cpf_cnpj=cpf_cnpj.replace(/(\d{4})(\d)/,"$1-$2")
				return cpf_cnpj
			} else return cpf_cnpj
		}),
		telefone: function (telefone) {
			setTimeout(function() {
				var r = telefone.value.replace(/\D/g, "");
				r = r.replace(/^0/, "");
				if (r.length > 10) {
					r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
				} else if (r.length > 5) {
					r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
				} else if (r.length > 2) {
					r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
				} else {
					r = r.replace(/^(\d*)/, "($1");
				}

				if (r != telefone.value) {
					telefone.value = r;
				}
			}, 1)
		},
		strip_accents: (function (texto) {
			var com_acento = ['à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ù', 'Ú', 'Û', 'Ü', 'Ý'];
			var sem_acento = ['a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'N', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y'];
			js.each(com_acento, function (chave, letra) {
				texto = js.replace(letra, sem_acento[chave], texto);
			});
			return texto;
		}),
		each: (function (lista, funcao) {
			var tamanho = 0;
			var usar_chave = false;
			var i = 0;
			var item = null;
			if ('length' in lista) {
				tamanho = lista.length;
			}
			if (funcao.length == 2) {
				usar_chave = true;
			}
			if (tamanho > 0) {
				for (i = 0; i < tamanho; i++) {
					if (usar_chave == true) {
						funcao(i, lista[i]);
					}
					else {
						funcao(lista[i]);
					}
				}
			}
			else {
				if (usar_chave == true) {
					for (item in lista) {
						funcao(item, lista[item]);
					}
				}
				else {
					for (item in lista) {
						funcao(lista[item]);
					}
				}
			}
		}),
		listeners: {
			codigo: function (e) {
				var sltd = window.getSelection().toString();
				var max = js.integer(this.getAttribute('maxlength'));
				if (max == 0) {
					max = 11;
				}
				if ((sltd == this.value) && ['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) === false) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				if (value.length > max) {
					value = value.substr(0, max);
				}
				this.value = value;
				if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) === false) {
					e.preventDefault();
				}
			},
			texto: function (e) {
				var value = this.value.replace(/[^A-z0-9ÀÁÂÃÄÅàáâãäÒÓÔÕÕÖòóôõöÈÉÊèéêÇçÌÍìíÙÚÜùúü\s].:,;/g, '');
				var max = js.integer(this.getAttribute('maxlength'));
				if (max == 0) {
					max = 255;
				}
				if (value.length > max) {
					value = value.substr(0, max);
				}
				this.value = value;
			},
			data: function (e) {
				var sltd = window.getSelection().toString();
				if ((sltd == this.value) && ((e.key != 'Tab') && (e.key != 'Enter'))) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				if (value.length >= 2) {
					value = value.substr(0, 2) + '/' + value.substr(2);
				}
				if (value.length >= 5) {
					value = value.substr(0, 5) + '/' + value.substr(5);
				}
				if (e.key == '/') {
					return false;
				}
				if (value.length > 10) {
					value = value.substr(0, 10);
				}
				this.value = value;
				if ((e.key != 'Tab') && (e.key != 'Enter')) {
					e.preventDefault();
				}
			},
			hora: function (e) {
				var sltd = window.getSelection().toString();
				if ((sltd == this.value) && ((e.key != 'Tab') && (e.key != 'Enter'))) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				if (value.length >= 2) {
					value = value.substr(0, 2) + ':' + value.substr(2);
				}
				if (value.length >= 5) {
					value = value.substr(0, 5) + ':' + value.substr(5);
				}
				if (e.key == ':') {
					return false;
				}
				if (value.length > 8) {
					value = value.substr(0, 8);
				}
				this.value = value;
				if ((e.key != 'Tab') && (e.key != 'Enter')) {
					e.preventDefault();
				}
			},
			moeda: function (e) {
				var max = js.integer(this.getAttribute('maxlength'));
				if (max == 0) {
					max = 11;
				}
				var sltd = window.getSelection().toString();
				if ((sltd == this.value) && ((e.key != 'Tab') && (e.key != 'Enter'))) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9\,]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				var integer = value.split(',')[0];
				var decimal = value.split(',')[1];
				if (decimal != null) {
					decimal = decimal + '';
					if (decimal.length > 2) {
						decimal = decimal.substr(0, 2);
					}
					value = integer + ',' + decimal;
				}
				else {
					value = integer;
					if (e.key == ',') {
						value = value + ',';
					}
				}
				if (value.length > max) {
					value = value.substr(0, max);
				}
				this.value = value;
				if ((e.key != 'Tab') && (e.key != 'Enter')) {
					e.preventDefault();
				}
			},
			peso: function (e) {
				var max = js.integer(this.getAttribute('maxlength'));
				if (max == 0) {
					max = 11;
				}
				var sltd = window.getSelection().toString();
				if ((sltd == this.value) && ((e.key != 'Tab') && (e.key != 'Enter'))) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9\,]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				var integer = value.split(',')[0];
				var decimal = value.split(',')[1];
				if (decimal != null) {
					decimal = decimal + '';
					if (decimal.length > 3) {
						decimal = decimal.substr(0, 3);
					}
					value = integer + ',' + decimal;
				}
				else {
					value = integer;
					if (e.key == ',') {
						value = value + ',';
					}
				}
				if (value.length > max) {
					value = value.substr(0, max);
				}
				this.value = value;
				if ((e.key != 'Tab') && (e.key != 'Enter')) {
					e.preventDefault();
				}
			},
			cpf_cnpj: function (e) {
				var sltd = window.getSelection().toString();
				var max = js.integer(this.getAttribute('maxlength'));
				if (max == 0) {
					max = 18;
				}
				if ((sltd == this.value) && ((e.key != 'Tab') && (e.key != 'Enter'))) {
					this.value = '';
				}
				var value = (this.value + e.key).replace(/[^0-9]/g, '');
				if (e.key == 'Backspace') {
					value = value.slice(0, -1);
				}
				if (e.key == 'Delete') {
					value = value.slice(0, -1);
				}
				if (value.length > max) {
					value = value.substr(0, max);
				}
				this.value = value;
				if ((e.key != 'Tab') && (e.key != 'Enter')) {
					e.preventDefault();
				}
			},
			help: function (e) {
				var codigo = e.target.getAttribute('js-help');
				e.preventDefault();
				js.topo().js.modal.open({
					content: "<div style='display:block; padding: 0px; margin:0px; background-color:transparent; width:800px; height:400px; overflow-y: auto'><img src='Imagens/manual/" + codigo + ".png'></div>"
				});
			},
			picker: function (e) {
				var campo = e.target.getAttribute('js-date-picker');
				e.preventDefault();
				js.topo().js.modal.open({
					url: js.url('/', {
						'exibir_calendario': 'S',
						'id_campo': campo,
						'formato': 'd/m/Y',
						'id_frame': (window.frameElement) ? window.frameElement.id : ''
					}),
					width: 600,
					height: 320
				});
			},
			confirm: function (e) {
				if (e.key == 'Enter') {
					eval(e.target.getAttribute('js-confirm'));
				}
			}
		},
		validation: {
			numero: function (e) {
				var value = this.value.replace(/[^0-9]/g, '');
			},
			texto: function (e) {
				var value = this.value.replace(/[^A-z0-9ÀÁÂÃÄÅàáâãäÒÓÔÕÕÖòóôõöÈÉÊèéêÇçÌÍìíÙÚÜùúü\s].:,;/g, '');
			},
			data: function (e) {
				var value = this.value.replace(/[^0-9]/g, '');
				var day = js.integer(value.substr(0, 2));
				var month = js.integer(value.substr(2, 2));
				var year = js.integer(value.substr(4));
				if ((value.length === 8) && (day > 0) && (day <= 31) && (month > 0) && (month <= 12)) {
					if (month !== 2) {
						return true;
					}
					if ((year % 4) === 0) {
						if (day <= 29) {
							return true;
						}
					}
					else if (day <= 28) {
						return true;
					}
				}
				this.value = '';
				return false;
			},
			hora: function (e) {
				var value = js.right(this.value.replace(/[^0-9]/g, ''), 8, '0');
				var hour = js.integer(value.substr(0, 2));
				var minute = js.integer(value.substr(2, 2));
				var seconds = js.integer(value.substr(4));
				if ((this.value.length) >= 1 &&
					(hour >= 0) && (hour <= 23) &&
					(minute >= 0) && (minute <= 59) &&
					(seconds >= 0) && (seconds <= 59)) {
					this.value = [
						js.left(String(hour), 2, '0'),
						js.left(String(minute), 2, '0'),
						js.left(String(seconds), 2, '0')
					].join(':');
					return true;
				}
				this.value = '';
				return false;
			},
			moeda: function (e) {
				var value = this.value.replace(/[^0-9\,]/g, '');
				if (value.length > 0) {
					var integer = js.integer(value.split(',')[0]);
					var decimal = js.right(value.split(',')[1] || 0, 2, '0').substr(0, 2);
					this.value = integer + ',' + decimal;
					return true;
				}
				this.value = '';
				return false;
			},
			peso: function (e) {
				var value = this.value.replace(/[^0-9\,]/g, '');
				if (value.length > 0) {
					var integer = js.integer(value.split(',')[0]);
					var decimal = value.split(',')[1];
					this.value = [integer, js.right(decimal, 3, '0')].join(',');
					return true;
				}
				this.value = '';
				return false;
			},
			cpf_cnpj: function (e) {
				var cpf_cnpj = js.replace([' ', '.', '-', '/'], '', this.value);
				var tamanho = cpf_cnpj.length;
				var soma = 0;
				var resto = 0;
				if (tamanho > 0) {
					if ((tamanho === 11) && (cpf_cnpj !== '00000000000')) {
						for (var i = 1; i <= 9; i = i + 1) {
							soma = soma + parseInt(cpf_cnpj.substring(i - 1, i)) * (11 - i);
						}
						resto = js.integer((soma * 10) % 11);
						if ((resto === 10) || (resto === 11)) {
							resto = 0;
						}
						if (resto === js.integer(cpf_cnpj.substr(9, 1))) {
							soma = 0;
							for (var i = 1; i <= 10; i = i + 1) {
								soma = soma + js.integer(cpf_cnpj.substring(i - 1, i)) * (12 - i);
							}
							resto = js.integer((soma * 10) % 11);
							if ((resto === 10) || (resto === 11)) {
								resto = 0;
							}
							if (resto === js.integer(cpf_cnpj.substr(10, 1))) {
								this.value = (cpf_cnpj.substr(0, 3) + '.' + cpf_cnpj.substr(3, 3) + '.' + cpf_cnpj.substr(6, 3) + '-' + cpf_cnpj.substr(9)).replace(/^\s+|\s+$/gm,'');
								return true;
							}
						}
					}
					else if (tamanho === 14) {
						tamanho = tamanho - 2;
						var numeros = cpf_cnpj.substring(0, tamanho);
						var digitos = cpf_cnpj.substring(tamanho);
						var pos = tamanho - 7;
						for (var i = tamanho; i >= 1; i = i - 1) {
							soma = soma + (js.integer(numeros.charAt(tamanho - i)) * pos--);
							if (pos < 2) {
								pos = 9;
							}
						}
						var resultado = ((soma % 11) < 2) ? 0 : (11 - soma % 11);
						if (resultado == js.integer(digitos.charAt(0))) {
							tamanho = tamanho + 1;
							numeros = cpf_cnpj.substring(0, tamanho);
							pos = tamanho - 7;
							soma = 0;
							for (var i = tamanho; i >= 1; i = i - 1) {
								soma = soma + js.integer(numeros.charAt(tamanho - i)) * pos--;
								if (pos < 2) {
									pos = 9;
								}
							}
							resultado = ((soma % 11) < 2) ? 0 : (11 - soma % 11);
							if (resultado == js.integer(digitos.charAt(1))) {
								this.value = (cpf_cnpj.substr(0, 2) + '.' + cpf_cnpj.substr(2, 3) + '.' + cpf_cnpj.substr(5, 3) + '/' + cpf_cnpj.substr(8, 4) + '-' + cpf_cnpj.substr(12)).replace(/^\s+|\s+$/gm,'');
								return true;
							}
						}
					}
					// this.value = '';
					return false;
				}
				return true;
			},
			telefone: function (e) {
				var telefone = this.value.match(/[0-9]/g) || [];
				var mascara = '';
				if (telefone.length === 10) {
					mascara = '(##) ####-####';
				} else if (telefone.length === 11) {
					mascara = '(##) #####-####';
				}
				this.value = mascara.replace(/\#/g, function () {
					return telefone.shift() || '';
				});
			}
		},
		mask: (function () {
			window.document.addEventListener('focus', function (event) {
				var element = event.target;
				if (element.getAttribute == null) {
					return false;
				}
				if (element.getAttribute('js-mask') == 'codigo') {
					element.removeEventListener('keydown', js.listeners.codigo, true);
					element.addEventListener('keydown', js.listeners.codigo, true);
				}
				else if (element.getAttribute('js-mask') == 'texto') {
					element.removeEventListener('keydown', js.listeners.texto, true);
					element.addEventListener('keydown', js.listeners.texto, true);
					element.removeEventListener('keyup', js.validation.texto, true);
					element.addEventListener('keyup', js.validation.texto, true);
				}
				else if (element.getAttribute('js-mask') == 'data') {
					element.removeEventListener('keydown', js.listeners.data, true);
					element.addEventListener('keydown', js.listeners.data, true);
					element.removeEventListener('blur', js.validation.data, true);
					element.addEventListener('blur', js.validation.data, true);
				}
				else if (element.getAttribute('js-mask') == 'hora') {
					element.removeEventListener('keydown', js.listeners.hora, true);
					element.addEventListener('keydown', js.listeners.hora, true);
					element.removeEventListener('blur', js.validation.hora, true);
					element.addEventListener('blur', js.validation.hora, true);
				}
				else if (element.getAttribute('js-mask') == 'moeda') {
					element.removeEventListener('keydown', js.listeners.moeda, true);
					element.addEventListener('keydown', js.listeners.moeda, true);
					element.removeEventListener('blur', js.validation.moeda, true);
					element.addEventListener('blur', js.validation.moeda, true);
				}
				else if (element.getAttribute('js-mask') == 'peso') {
					element.removeEventListener('keydown', js.listeners.peso, true);
					element.addEventListener('keydown', js.listeners.peso, true);
					element.removeEventListener('blur', js.validation.peso, true);
					element.addEventListener('blur', js.validation.peso, true);
				}
				else if (element.getAttribute('js-mask') == 'cpf-cnpj') {
					element.removeEventListener('keydown', js.listeners.cpf_cnpj, true);
					element.addEventListener('keydown', js.listeners.cpf_cnpj, true);
					element.removeEventListener('blur', js.validation.cpf_cnpj, true);
					element.addEventListener('blur', js.validation.cpf_cnpj, true);
				}
				else if (element.getAttribute('js-mask') == 'telefone') {
					element.removeEventListener('blur', js.validation.telefone, true);
					element.addEventListener('blur', js.validation.telefone, true);
				}
				if (element.getAttribute('js-confirm') != null) {
					element.removeEventListener('keydown', js.listeners.confirm, true);
					element.addEventListener('keydown', js.listeners.confirm, true);
				}
				if (element.getAttribute('js-help') != null) {
					element.removeEventListener('click', js.listeners.help, true);
					element.addEventListener('click', js.listeners.help, true);
				}
				if (element.getAttribute('js-date-picker') != null) {
					element.removeEventListener('click', js.listeners.picker, true);
					element.addEventListener('click', js.listeners.picker, true);
				}
				return true;
			}, true);
			window.document.addEventListener('mouseover', function (event) {
				var element = event.target;
				if (element.getAttribute == null) {
					return false;
				}
				if (element.getAttribute('js-help') != null) {
					element.removeEventListener('click', js.listeners.help, true);
					element.addEventListener('click', js.listeners.help, true);
				}
				if (element.getAttribute('js-date-picker') != null) {
					element.removeEventListener('click', js.listeners.picker, true);
					element.addEventListener('click', js.listeners.picker, true);
				}
			}, true);
		}),
		modal: {
			open: (function (parameters) {
				var idModal = 'id-' + js.date('YmdHisu');
				var modalOverlay = document.createElement('div');
				var modalContainer = document.createElement('div');
				var modalHeader = document.createElement('div');
				var modalContent = document.createElement('div');
				var modalClose = document.createElement('div');
				var settings = {
					draggable: true,
					width: 860,
					height: 500,
					content: '',
					element: null,
					url: '',
					openCallback: false,
					closeCallback: false
				};
				if (parameters.draggable) {
					settings.draggable = parameters.draggable;
				}
				if (typeof parameters.closeCallback === 'function') {
					settings.closeCallback = parameters.closeCallback;
				}
				if (parameters.openCallback) {
					settings.openCallback = parameters.openCallback;
				}
				if (parameters.width) {
					settings.width = parameters.width;
				}
				if (parameters.height) {
					settings.height = parameters.height;
				}
				if (parameters.content) {
					modalContent.innerHTML = parameters.content;
				}
				if (parameters.element) {
					modalContent.appendChild(parameters.element);
					modalContainer.style.width = (parameters.width !== undefined ? (settings.width + 'px') : "980px");
				}
				modalClose.onclick = function () {
					js.modal.close(idModal);
				};
				modalOverlay.onclick = function () {
					js.modal.close(idModal);
				};
				if (settings.draggable) {
					modalHeader.style.cursor = 'move';
					modalHeader.onmousedown = function (e) {
						var xPosition = e.clientX, yPosition = e.clientY, differenceX = xPosition - modalContainer.offsetLeft, differenceY = yPosition - modalContainer.offsetTop;
						document.onmousemove = function (e) {
							xPosition = e.clientX;
							yPosition = e.clientY;
							modalContainer.style.left = ((xPosition - differenceX) > 0) ? (xPosition - differenceX) + 'px' : '0px';
							modalContainer.style.top = ((yPosition - differenceY) > 0) ? (yPosition - differenceY) + 'px' : '0px';
							document.onmouseup = function () {
								window.document.onmousemove = null;
							};
						};
					};
				}
				modalOverlay.setAttribute('id', 'modal-overlay-' + idModal);
				modalContainer.setAttribute('id', 'modal-container-' + idModal);
				modalHeader.setAttribute('id', 'modal-header-' + idModal);
				modalContent.setAttribute('id', 'modal-content-' + idModal);
				modalClose.setAttribute('id', 'modal-close-' + idModal);
				modalOverlay.setAttribute('class', 'modal-overlay');
				modalContainer.setAttribute('class', 'modal-container');
				modalHeader.setAttribute('class', 'modal-header');
				modalContent.setAttribute('class', 'modal-content');
				modalClose.setAttribute('class', 'modal-close');
				modalHeader.appendChild(modalClose);
				modalContainer.appendChild(modalHeader);
				modalContainer.appendChild(modalContent);
				document.body.appendChild(modalOverlay);
				document.body.appendChild(modalContainer);
				if (parameters.url) {
					var url = parameters.url + '&id-modal=' + idModal + '&id_modal=' + idModal;
					modalContent.innerHTML = "\n            <iframe\n              name=\"frame-modal-" + idModal + "\"\n              id=\"frame-modal-" + idModal + "\"\n              src='" + url + "'\n              style=\"padding:0px; margin:0px; background-color:transparent; width: " + settings.width + "px; height: " + settings.height + "px; overflow-y:scroll; border-top:0px; border-left:0px; border-style:none\"\n              border=\"0\"\n            ></iframe>\n          ";
				}
				var documentHeight = Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0), modalWidth = settings.width, modalHeight = settings.height, browserWidth = window.screen.availWidth, browserHeight = window.screen.availHeight, amountScrolledX = 0, amountScrolledY = 0;
				var topContainer = 200;
				var leftContainer = 400;
				amountScrolledY = Math.max(window.pageYOffset || 0, document.body.scrollTop || 0, document.documentElement.scrollTop || 0);
				amountScrolledX = Math.max(window.pageXOffset || 0, document.body.scrollLeft || 0, document.documentElement.scrollLeft || 0);
				topContainer = amountScrolledY + ((browserHeight - modalHeight - 90) / 2);
				leftContainer = amountScrolledX + ((browserWidth - modalWidth - 60) / 2);
				modalContainer.style.top = topContainer + 'px';
				modalContainer.style.left = leftContainer + 'px';
				modalOverlay.style.height = documentHeight + 'px';
				modalOverlay.style.width = '100%';
				return idModal;
			}),
			close: (function (modal) {
				let bloqueio = parent.frames['FrameCorpo'].BLOQUEIO_ITENS;

				if(bloqueio != undefined || bloqueio != null){
					if(bloqueio.type == 'identificador'){
						bloqueio.component.style.display = 'none';
					}
				}

				if (modal != null) {
					js.remove('#modal-overlay-' + modal);
					js.remove('#modal-container-' + modal);
				}
				else {
					js.remove('.modal-overlay');
					js.remove('.modal-container');
				}
			})
		},
		element: (function (selector) {
			return window.document.querySelector(selector);
		}),
		elements: (function (selector) {
			return window.document.querySelectorAll(selector);
		}),
		remove: (function (element) {
			if (js.is_string(element) == true) {
				element = js.element(String(element));
			}
			try {
				var parent_element = element.parentNode;
				parent_element.removeChild(element);
			}
			catch (e) { }
		}),
		url: (function (endereco, params) {
			var url = js.replace('\\', '/', window.location.href);
			var opt = [];
			url = (url.indexOf('?') > 0) ? url.substr(0, url.indexOf('?') + 1) : url;
			for (var key in params) {
				opt.push(key + '=' + params[key]);
			}
			url = url.substr(0, url.lastIndexOf('/')) + endereco;
			if (opt.length > 0) {
				url = url + '?' + opt.join('&');
			}
			return url;
		}),
		loader: (function (show) {
			if (show == true) {
				var base = document.createElement('div');
				var loader = document.createElement('div');
				var img = document.createElement('img');
				// var p = document.createElement('p');
				// p.innerHTML = 'Aguarde, carregando...';
				img.classList.add('loader-img');
				img.setAttribute('src', js.url('/assets/img/loading.svg'));
				loader.classList.add('loader-msg');
				loader.appendChild(img);
				// loader.appendChild(p);
				base.classList.add('loader');
				base.appendChild(loader);
				document.body.appendChild(base);
			}
			else {
				js.remove('.loader');
			}
		}),
		request: {
			send: (function (opt) {
				var method = opt.method;
				var url = opt.url;
				var data = opt.data;
				var complete = opt.complete;
				var loader = opt.loader;
				var parse = opt.parse || true;
				var fr = document.createElement('iframe');
				if (loader) {
					js.loader(true);
				}
				fr.setAttribute('id', 'fake-ajax-iframe-' + js.date('u'));
				fr.setAttribute('src', '#');
				fr.setAttribute('style', 'display: none');
				js.element('body').appendChild(fr);
				var doc = fr.contentDocument || fr.contentWindow.document;
				var doc_body = doc.body;
				var fm = doc.createElement('form');
				fm.setAttribute('id', 'fake-ajax-form-' + js.date('u'));
				fm.setAttribute('method', method);
				fm.setAttribute('action', url);
				for (var key in data) {
					var field = document.createElement('textarea');
					if ((js.is_array(data[key]) == true) || (js.is_object(data[key]) == true)) {
						data[key] = JSON.stringify(data[key]);
					}
					field.setAttribute('name', key);
					field.innerHTML = data[key];
					fm.appendChild(field);
				}
				doc_body.appendChild(fm);
				doc_body.querySelector('#' + fm.id).submit();
				fr.onload = (function () {
					var doc = (fr.contentDocument || fr.contentWindow.document);
					if (parse) {
						try {
							complete(JSON.parse(doc.body.innerHTML));
						}
						catch (e) {
							console.log('ERRO AO INTERPRETAR RESPOSTA', e, '\n', doc.body.innerHTML);
						}
					}
					else {
						complete(doc.body.innerHTML);
					}
					if (loader) {
						js.loader(false);
					}
					js.remove(fr);
				});
			}),
			post: (function (url, data, complete, loader) {
				if (loader === void 0) { loader = true; }
				js.request.send({
					method: 'post',
					url: js.url(url),
					data: data,
					complete: complete,
					loader: loader
				});
			}),
			get: (function (url, data, complete, loader) {
				if (loader === void 0) { loader = true; }
				js.request.send({
					method: 'get',
					url: js.url(url),
					data: data,
					complete: complete,
					loader: loader
				});
			})
		},
		download: (function (endereco, params, tempo_remover) {
			if (tempo_remover === void 0) { tempo_remover = 5000; }
			var fr = document.createElement('iframe');
			fr.setAttribute('id', 'download-iframe-' + js.date('u'));
			fr.setAttribute('style', 'display: none');
			fr.setAttribute('src', js.url(endereco, params));
			js.element('body').appendChild(fr);
			window.setTimeout(function () {
				js.remove(fr);
			}, tempo_remover);
		}),
		paginate: (function (lista, numero_pagina, quantidade_por_pagina) {
			if (quantidade_por_pagina === void 0) { quantidade_por_pagina = 50; }
			var inicio = 0;
			var fim = 0;
			var pagina = [];
			var total = 0;
			inicio = (numero_pagina - 1) * quantidade_por_pagina;
			fim = inicio + quantidade_por_pagina;
			js.each(lista, function (item) {
				if ((total >= inicio) && (total < fim)) {
					pagina.push(item);
				}
				total = total + 1;
			});
			if (total > 0) {
				total = Math.ceil(total / quantidade_por_pagina);
			}
			if (total == 0) {
				total = 1;
			}
			return {
				pagina: pagina,
				total: total
			};
		}),
		tab: (function() {
			window.document.addEventListener('click', function (event) {
			  var element = event.target;
			  if (element.getAttribute == null) {
				return false;
			  }
			  if (element.getAttribute("js-tab")) {
			  let listaInput = window.document.body.getElementsByTagName("input");
				for(var input of listaInput) 
				  input.classList.remove("ativo")

				element.classList.add("ativo")
				ativarDivTab()
			  }
			});

			function ativarDivTab() {
			  if (!window.document.body) return;
			  let listaInput = window.document.body.getElementsByTagName("input");
			  
			  for(var div of window.document.documentElement.querySelectorAll(".tab")) {
				div.style.display = "none"
			  }
			  
			  for(var input of listaInput) {
				  if (input.getAttribute("js-tab") == null) return false
				  
				input.classList.add("btn", "btn-desativado")
				if (input.classList.contains("ativo")) {
				  let id = "#tab-" + input.getAttribute("js-tab");
				  document.querySelector(id).style.display = "block"
				}
			  }
		  }
		  ativarDivTab()
		}),
		initialize: (function (fn) {
			if (typeof fn === 'function') {
				window.addEventListener('load', fn, true);
			}
		}),
		disabled:(function(component, type, disabled){
			if(disabled == true){
				if(type == 'identificador'){
					component.style.display = 'block';
				}
			}else if (disabled == false){
				if(type == 'identificador'){
					component.style.display = 'none';
				}
			}
		}),
		prompt:{
			password:(function(user_informed_message, file, router, run, parameter){
				//let mega_div = document.querySelector('#div_bloqueio');
				//mega_div.style.display = 'block';
				
				//mega_div.setAttribute('class','flex');
				let check_password = document.createElement('div');
				check_password.classList.add('component');
				check_password.style.fontFamily = 'Verdana';

				let head = document.createElement('div');
				head.classList.add('head');
				check_password.appendChild(head);

				let h5 = document.createElement('h5');
				h5.classList.add('text');
				h5.classList.add('text-center');
				h5.innerText = 'Atenção!';
				head.appendChild(h5);

				let body = document.createElement('div');
				body.classList.add('body');

				let row_message = document.createElement('div');
				row_message.classList.add('row');
				let message = document.createElement('div');
				message.classList.add('col-12');
				message.innerText = user_informed_message;
				row_message.appendChild(message);
				body.appendChild(row_message);

				let incorrect_message_line = document.createElement('div');
				incorrect_message_line.classList.add('row');
				let wrong_message = document.createElement('div');
				wrong_message.classList.add('col-12');
				wrong_message.classList.add('text-center');
				wrong_message.classList.add('senha_incorreta');
				wrong_message.style.display = 'none';
				wrong_message.id = 'mensagem_senha_incorreta';
				wrong_message.innerText = 'Senha incorreta ou inválida';
				let br = document.createElement('br');
				incorrect_message_line.appendChild(br);
				incorrect_message_line.appendChild(wrong_message);
				body.appendChild(incorrect_message_line);

				let row_input = document.createElement('div');
				row_input.classList.add('row');
				let column = document.createElement('div');
				column.classList.add('push-3');
				column.classList.add('col-6');
				let password = document.createElement('input');
				password.type = 'password';
				password.classList.add('field');
				password.classList.add('text-center');
				password.id = 'input_senha';
				password.setAttribute('js-confirm', "js.element('#btn_confirmar_senha').click()");
				password.placeholder = 'Digite a senha';
				password.style.marginTop = '5px';
				password.setAttribute('OnKeyUp', 'limpar_campo_senha();');
				password.addEventListener('focus', function(event){
					password_focus(); 
				});

				/*click_simulado = new CustomEvent('click');
				password.dispatchEvent(click_simulado);*/

				row_input.appendChild(password);
				column.appendChild(password);
				body.appendChild(column);

				let row_button = document.createElement('div');
				row_button.classList.add('row');
				let column_button = document.createElement('div');
				column_button.classList.add('push-3');
				column_button.classList.add('col-6');
				let button = document.createElement('button');
				button.classList.add('btn');
				button.id = 'btn_confirmar_senha';
				button.innerText = 'Confirmar';
				button.addEventListener('click', function(event){
					if(password.value !== ''){
						js.request.post(file, {'rota':router, 'senha':password.value}, function(router_return){
							if(router_return.login == ''){
								wrong_message.style.display = 'block';
								password.value = '';
								password.focus();
							}else{
								funcao_modal_senha(router_return, run, parameter);
								parent.js.modal.close();
							}
						}, false);
					}else{
						password.focus();
					}
				});
				column_button.appendChild(button);
				row_button.appendChild(column_button);
				body.appendChild(row_button);
				
				check_password.appendChild(body);
				
				parent.js.modal.open({element:check_password, width:535});
				button.click();
			})
		},
		// Retorna o nome do código de tecla
		// param::integer (codigo) O 'keyCode' do evento
		// return::string
		key: (function (codigo) {
			var KEYS = {
				'65': 'A', '66': 'B', '67': 'C', '68': 'D', '69': 'E', '70': 'F', '71': 'G', '72': 'H', '73': 'I', '74': 'J', '75': 'K', '76': 'L', '77': 'M', '78': 'N', '79': 'O', '80': 'P', '81': 'Q', '82': 'R', '83': 'S', '84': 'T', '85': 'U', '86': 'V', '87': 'W', '88': 'X', '89': 'Y', '90': 'Z',
				'48': 'NUMBER_0', '49': 'NUMBER_1', '50': 'NUMBER_2', '51': 'NUMBER_3', '52': 'NUMBER_4', '53': 'NUMBER_5', '54': 'NUMBER_6', '55': 'NUMBER_7', '56': 'NUMBER_8', '57': 'NUMBER_9',
				'96': 'CALC_0', '97': 'CALC_1', '98': 'CALC_2', '99': 'CALC_3', '100': 'CALC_4', '101': 'CALC_5', '102': 'CALC_6', '103': 'CALC_7', '104': 'CALC_8', '105': 'CALC_9',
				'112': 'F1', '113': 'F2', '114': 'F3', '115': 'F4', '116': 'F5', '117': 'F6', '118': 'F7', '119': 'F8', '120': 'F9', '121': 'F10', '122': 'F11', '123': 'F12',
				'13': 'ENTER', '9': 'TAB', '17': 'CTRL', '16': 'SHIFT', '27': 'ESC', '32': 'SPACE', '37': 'LEFT', '38': 'UP', '39': 'RIGHT', '40': 'DOWN', '8': 'BACKSPACE', '46': 'DELETE',
				'188': 'COMMA', '190': 'DOT', '110': 'CALC_COMMA', '194': 'CALC_DOT', '193': 'SLASH', '111': 'CALC_SLASH', '106': 'MULTIPLY', '91': 'WIN_LEFT','92': 'WIN_RIGHT'
			};
			return KEYS[js.string(codigo)] || 'NULL';
		}),
		arredondar: (function(valor, operacao = '', quantidade = null, casas_decimais = 2){
			// verifica se o "valor" não esta de acordo com o esperado e seta 0 a ele
			if (valor == undefined || valor == null){
				valor = 0;
			}
			// transforma a quantidade para float verificando se é maior que 0 para realizar calculos
			valor = parseFloat(valor);
			if (quantidade != null && quantidade != undefined && operacao != '') {
				quantidade = parseFloat(quantidade);
				// a partir da operação passada pelo usuário é realizado o cálculo
				if (operacao == '*') {
					valor = valor * quantidade;
				} else if (operacao == '+') {
					valor = valor + quantidade;
				} else if (operacao == '-') {
					valor = valor - quantidade;
				} else if (operacao == '/') {
					valor = valor / quantidade;
				}
			}
			if (valor != 0){    // apenas irá arredondar se o "valor" for diferente de 0
				// após os calculos (opcionais) é iniciado a rotina de arredondamento
				let auxiliar_precisao = 2;
				let auxiliar_comparacao = 5 * Math.pow(10, auxiliar_precisao-1);
					
				// recupera o valor em string
				let numero_string = valor.toFixed((casas_decimais+auxiliar_precisao));
				let numero_inteiro = parseInt(numero_string.replace('.',''));
		
				let sobra = parseInt((numero_inteiro + "").substr(-auxiliar_precisao));
				let numero = parseInt((numero_inteiro + "").substr(0, ((numero_inteiro+"").length - auxiliar_precisao) ));

				if(isNaN(numero)){
					return 0;
				}
				
				if(numero % 2 == 0){
					if(sobra > auxiliar_comparacao){numero++;}
				} else {
					if(sobra >= auxiliar_comparacao){numero++;}
				}
				
				numero = (numero / Math.pow(10, casas_decimais)).toFixed(casas_decimais);
				return parseFloat(numero);
			}
			return 0;
		}),
	};
	window.document.addEventListener('DOMContentLoaded', function () {
		try {
			js.topo().EscondeDivTempo();
			if (window.addEventListener) window.addEventListener('keydown', function (e) {
				if (e.key == 'Escape') js.topo().js.modal.close();
			}, false);
			else if (document.attachEvent) document.attachEvent('onkeydown', function (e) {
				if (e.key == 'Escape') js.topo().js.modal.close();
			});
		}
		catch (e) { }
		js.mask();
		js.tab();
	}, true);
	return js;
})(window);


cookies_filtro = () => {
	var pathname = (window.location.pathname).replace("/", "");
	pathname = "_" + pathname.substr(0, pathname.search("/"))
	return pathname
}
  