'use strict'

$(document).ready(function () {
    const debug = $('#debug');
    const socket = io(ServerUrl);

    socket.on('mod.announcements.connected', function (data) {
        $('#Content').removeClass('hide');
        $('#FormWidget .panel').removeClass('panel-danger').addClass('panel-success');
    });
    socket.on('disconnect', function (data) {
        $('#FormWidget .panel').removeClass('panel-success').addClass('panel-danger');
    });

    socket.on('mod.announcements.response', function (data) {
        let message = '';
        let style = 'success';

        if (data.status) {
            if (data.response.announcedChannels.length) {
                message = 'Announced on channels:<ul>';
                for (let k in data.response.announcedChannels) {
                    message += data.response.announcedChannels[k].name;
                }
                message += '</ul>';
            } else {
                style = 'warning';
                message = 'No channels registered.';
            }
        } else {
            message = '<pre>' + data.error + '</pre>';
            style = 'danger';
        }

        debug.append('<div class="alert alert-' + style + '" role="alert"><strong>mod.announcements.response</strong>:<br/>' + message + '</div>')
    });

    $('#ClearButton').on('click', function (event) {
        $('#MessageForm')[0].reset();
    });

    const submit = function (event) {
        event.preventDefault();
        event.stopPropagation();

        const server = $('#server').val();
        const message = $('#message').val();

        if (server && message) {
            socket.emit('mod.announcements.announce', {
                message: message,
                server: server
            });
        } else {
            if (!server) {
                alert('You need to specify a server.');
            } else if (!message) {
                alert('You need to specify a message.');
            }
        }
    };
    $('#SubmitButton').on('click', submit);
    $('#MessageForm').on('submit', submit);
});