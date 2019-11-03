from crontab import CronTab

cron = CronTab(user='subbash')
job = cron.new(command='python3 process.py')
job.minute.every(1)

cron.write()
