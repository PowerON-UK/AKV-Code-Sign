import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', function () {

    before( function() {

    });

    after(() => {

    });  

    it('running taskSetup should not fail', function(done: Mocha.Done) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'runTaskSetup.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log('Run Status: ' + tr.succeeded);
        console.log(tr.stdout);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('running taskSetup multiple times should not fail', function(done: Mocha.Done) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'runTaskSetup.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log('Run Status: ' + tr.succeeded);
        console.log(tr.stdout);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");

        tr.run();
        console.log('Run Status 2: ' + tr.succeeded);
        console.log(tr.stdout);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        
        done();
    });

    it('should succeed with simple inputs', function(done: Mocha.Done) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log('Run Status: ' + tr.succeeded);
        console.log(tr.stdout);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(tr.stdout.indexOf('Hello human') >= 0, true, "should display Hello human");
        done();
    });

    it('it should fail if tool returns 1', function(done: Mocha.Done) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log('Run Status: ' + tr.succeeded);
        console.log(tr.stdout);
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Bad input was given', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Hello bad'), -1, "Should not display Hello bad");
    
        done();
    });
});