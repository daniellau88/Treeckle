from crontab import CronTab

cron = CronTab(user='subbash')
job = cron.new(command='python3 process.py')
job.minute.every(10)

cron.write()
