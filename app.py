from flask import Flask, render_template, request, jsonify
import string
import random

app = Flask(__name__)


def generate_password(length, include_uppercase, include_lowercase, include_numbers, include_symbols):
    uppercase_chars = string.ascii_uppercase if include_uppercase else ''
    lowercase_chars = string.ascii_lowercase if include_lowercase else ''
    number_chars = string.digits if include_numbers else ''
    symbol_chars = string.punctuation if include_symbols else ''

    all_chars = uppercase_chars + lowercase_chars + number_chars + symbol_chars

    if not all_chars:
        raise ValueError('At least one character set must be selected.')

    password = ''.join(random.choice(all_chars) for _ in range(length))
    return password


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/generate-password', methods=['POST'])
def api_generate_password():
    data = request.json
    password_length = data.get('password_length', 12)
    include_uppercase = data.get('include_uppercase', False)
    include_lowercase = data.get('include_lowercase', False)
    include_numbers = data.get('include_numbers', False)
    include_symbols = data.get('include_symbols', False)

    try:
        password = generate_password(
            password_length,
            include_uppercase,
            include_lowercase,
            include_numbers,
            include_symbols
        )
        return jsonify({'password': password})
    except ValueError:
        return jsonify({'error': 'At least one character set must be selected.'}), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
