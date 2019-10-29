from crontab import CronTab

cron = CronTab(user='subbash')
job = cron.new(command='python3 in.py')
job.minute.every(10)

cron.write()
