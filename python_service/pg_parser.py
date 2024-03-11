# Import txt and split on '* * *', and save individually
def parse_txt(file_path):
    with open(file_path, 'r') as f:
        data = f.read()
        data = data.split('* * *')
        for i in range(len(data)):
            essayData = data[i].strip()
            with open(f'./python_service/retrievers/data/{i}.txt', 'w') as f:
                f.write(essayData)

parse_txt('python_service/retrievers/data/graham.txt')
